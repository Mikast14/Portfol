"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Conversation {
  userId: string;
  username: string;
  profileImage?: string;
  email: string;
  lastMessage: {
    content?: string;
    projectId?: {
      _id: string;
      name: string;
      description?: string;
      image?: string;
    };
    createdAt: string;
    senderId: {
      _id: string;
      username: string;
    };
  };
  unreadCount: number;
}

interface Message {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  receiverId: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  content?: string;
  projectId?: {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    githubRepo?: string;
    platforms?: string[];
  };
  createdAt: string;
  read: boolean;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Project[]>([]);
  const [projectSelectorTab, setProjectSelectorTab] = useState<"my" | "bookmarked">("my");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [swipedMessageId, setSwipedMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeCurrentX, setSwipeCurrentX] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    messageId: string;
    x: number;
    y: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const swipeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close swiped message when clicking outside (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (swipedMessageId) {
        const target = event.target as Node;
        const swipedElement = swipeRefs.current.get(swipedMessageId);
        if (swipedElement && !swipedElement.contains(target)) {
          setSwipedMessageId(null);
        }
      }
    };

    if (swipedMessageId) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [swipedMessageId, isMobile]);

  // Close context menu when clicking outside (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [contextMenu, isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversations
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchConversations = async (isInitial = false) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/chat/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          // Only update if conversations actually changed (compare by last message timestamp)
          setConversations((prevConversations) => {
            if (isInitial) {
              // Initial load - always update
              return data.data;
            }
            
            // Check if any conversation has a new last message
            const hasChanges = prevConversations.length !== data.data.length ||
              prevConversations.some((prevConv, index) => {
                const newConv = data.data[index];
                if (!newConv || prevConv.userId !== newConv.userId) return true;
                const prevTime = new Date(prevConv.lastMessage.createdAt).getTime();
                const newTime = new Date(newConv.lastMessage.createdAt).getTime();
                return prevTime !== newTime || prevConv.unreadCount !== newConv.unreadCount;
              });
            
            return hasChanges ? data.data : prevConversations;
          });
          
          // If userId query param exists, select that conversation
          const userIdParam = searchParams.get("userId");
          if (userIdParam) {
            setSelectedConversation(userIdParam);
            // Remove query param from URL
            router.replace("/chat", { scroll: false });
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        if (isInitial) {
          setLoadingConversations(false);
        }
      }
    };

    fetchConversations(true);
    // Refresh conversations every 10 seconds (but only update if changed)
    const interval = setInterval(() => fetchConversations(false), 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, searchParams, router]);

  // Initial fetch of all messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation || !isAuthenticated) {
      setMessages([]);
      setLastMessageTimestamp(null);
      return;
    }

    const fetchAllMessages = async () => {
      setLoadingMessages(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/chat/messages?userId=${selectedConversation}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok && Array.isArray(data.data)) {
          setMessages(data.data);
          // Set the timestamp of the last message
          if (data.data.length > 0) {
            const lastMsg = data.data[data.data.length - 1];
            setLastMessageTimestamp(lastMsg.createdAt);
          } else {
            setLastMessageTimestamp(null);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchAllMessages();
  }, [selectedConversation, isAuthenticated]);

  // Poll for new messages only (not all messages)
  useEffect(() => {
    if (!selectedConversation || !isAuthenticated || !lastMessageTimestamp) return;

    const checkForNewMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `/api/chat/messages?userId=${selectedConversation}&since=${encodeURIComponent(lastMessageTimestamp)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data.ok && Array.isArray(data.data) && data.data.length > 0) {
          // Only update if there are new messages
          setMessages((prevMessages) => {
            // Merge new messages, avoiding duplicates
            const existingIds = new Set(prevMessages.map((m) => m._id));
            const newMessages = data.data.filter((m: Message) => !existingIds.has(m._id));
            
            if (newMessages.length > 0) {
              const updated = [...prevMessages, ...newMessages].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
              // Update last message timestamp
              const lastMsg = updated[updated.length - 1];
              setLastMessageTimestamp(lastMsg.createdAt);
              return updated;
            }
            return prevMessages;
          });
        }
      } catch (error) {
        console.error("Error checking for new messages:", error);
      }
    };

    // Check for new messages every 3 seconds
    const interval = setInterval(checkForNewMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation, isAuthenticated, lastMessageTimestamp]);

  // Fetch user projects and bookmarked projects for sharing
  const fetchUserProjects = async () => {
    setLoadingProjects(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch user's own projects
      const projectsRes = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const projectsData = await projectsRes.json();
      if (projectsData.ok) {
        setUserProjects(projectsData.data || []);
      }

      // Fetch bookmarked projects
      const bookmarksRes = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bookmarksData = await bookmarksRes.json();
      if (bookmarksData.ok) {
        setBookmarkedProjects(bookmarksData.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSendMessage = async (projectId?: string) => {
    if (!selectedConversation || (!messageInput.trim() && !projectId) || sendingMessage) return;

    const content = projectId ? undefined : messageInput.trim();
    if (!content && !projectId) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedConversation,
          content,
          projectId,
        }),
      });

      const data = await res.json();
      if (data.ok && data.data) {
        setMessageInput("");
        setShowProjectSelector(false);
        // Add the new message to the list immediately
        setMessages((prevMessages) => {
          const updated = [...prevMessages, data.data].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setLastMessageTimestamp(data.data.createdAt);
          return updated;
        });
        // Refresh conversations to update last message
        const convRes = await fetch("/api/chat/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const convData = await convRes.json();
        if (convData.ok) {
          setConversations(convData.data);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleShareProject = (project: Project) => {
    handleSendMessage(project._id);
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message._id);
    setEditMessageContent(message.content || "");
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editMessageContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/chat/messages", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: editingMessageId,
          content: editMessageContent.trim(),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        // Update the message in the list
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === editingMessageId ? data.data : msg
          )
        );
        setEditingMessageId(null);
        setEditMessageContent("");
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  const handleDeleteClick = (messageId: string) => {
    setSwipedMessageId(null); // Close swipe buttons first (mobile)
    setContextMenu(null); // Close context menu first (desktop)
    setShowDeleteConfirm(messageId);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;

    const messageId = showDeleteConfirm;
    setShowDeleteConfirm(null);
    setDeletingMessageId(messageId);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/chat/messages?messageId=${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.ok) {
        // Remove the message from the list
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        // Refresh conversations
        const convRes = await fetch("/api/chat/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const convData = await convRes.json();
        if (convData.ok) {
          setConversations(convData.data);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleSwipeStart = (e: React.TouchEvent, message: Message) => {
    if (!isMobile) return;
    const isOwn = message.senderId._id === user?.id;
    // Only allow swipe for own messages
    if (!isOwn) return;

    // Close any previously swiped message with smooth animation
    if (swipedMessageId && swipedMessageId !== message._id) {
      setSwipedMessageId(null);
    }

    const clientX = e.touches[0].clientX;
    setSwipeStartX(clientX);
    setSwipeCurrentX(clientX);
  };

  const handleSwipeMove = (e: React.TouchEvent, message: Message) => {
    if (!isMobile || swipeStartX === null) return;

    const isOwn = message.senderId._id === user?.id;
    if (!isOwn) return;

    const clientX = e.touches[0].clientX;
    setSwipeCurrentX(clientX);
  };

  const handleSwipeEnd = (e: React.TouchEvent, message: Message) => {
    if (!isMobile) return;
    if (swipeStartX === null || swipeCurrentX === null) {
      setSwipeStartX(null);
      setSwipeCurrentX(null);
      return;
    }

    const deltaX = swipeStartX - swipeCurrentX;
    const threshold = 60; // Minimum swipe distance to reveal buttons

    if (deltaX > threshold) {
      // Swiped left - reveal buttons
      setSwipedMessageId(message._id);
    } else {
      // Swiped back or not enough - hide buttons with smooth animation
      setSwipedMessageId(null);
    }

    // Delay clearing swipe state to allow smooth transition
    setTimeout(() => {
      setSwipeStartX(null);
      setSwipeCurrentX(null);
    }, 300);
  };

  const handleSwipeCancel = () => {
    if (!isMobile) return;
    setSwipedMessageId(null);
    // Delay clearing swipe state to allow smooth transition
    setTimeout(() => {
      setSwipeStartX(null);
      setSwipeCurrentX(null);
    }, 300);
  };

  const handleRightClick = (e: React.MouseEvent, message: Message) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    const isOwn = message.senderId._id === user?.id;
    // Only show context menu for own messages
    if (isOwn) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setContextMenu({
        messageId: message._id,
        x: rect.right,
        y: rect.bottom,
      });
    }
  };


  const handleOpenProjectSelector = () => {
    setShowProjectSelector(true);
    if (userProjects.length === 0 && bookmarkedProjects.length === 0) {
      fetchUserProjects();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find((c) => c.userId === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-50">
      <Navbar />
      <div className="fixed md:relative inset-x-0 top-20 md:top-auto bottom-0 md:bottom-auto pt-0 md:pt-28 pb-0 md:pb-8 px-0 md:px-4 max-w-full md:max-w-7xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] min-h-0">
        <div className="bg-white md:bg-white rounded-none md:rounded-2xl shadow-none md:shadow-lg overflow-hidden h-full flex flex-col min-h-0">
          <div className="flex h-full flex-col md:flex-row relative overflow-hidden">
            {/* Conversations List */}
            <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col md:flex-1 transition-transform duration-300 ease-in-out ${
              isMobile && selectedConversation ? "-translate-x-full absolute inset-0 z-10 bg-white" : ""
            }`}>
              <div className="p-3 md:p-4 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Messages</h2>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                {loadingConversations ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-3 md:p-4 text-center text-gray-500">
                    <p className="text-sm md:text-base">No conversations yet</p>
                    <p className="text-xs md:text-sm mt-2">Start chatting with other users!</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv.userId)}
                      className={`w-full p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation === conv.userId ? "bg-accent/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        {conv.profileImage ? (
                          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                            <Image
                              src={conv.profileImage}
                              alt={conv.username}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-gray-200 shrink-0">
                            <span className="text-base md:text-lg font-semibold text-accent">
                              {conv.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{conv.username}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-accent text-white text-xs font-bold rounded-full px-1.5 md:px-2 py-0.5 shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-gray-500 truncate">
                            {conv.lastMessage.projectId
                              ? `Shared: ${conv.lastMessage.projectId.name}`
                              : conv.lastMessage.content || "No message"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 md:mt-1">
                            {formatTime(conv.lastMessage.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col min-h-0 transition-transform duration-300 ease-in-out ${
              isMobile && !selectedConversation ? "hidden md:flex" : ""
            } ${isMobile && selectedConversation ? "absolute inset-0 z-20 bg-white" : ""}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 md:p-4 border-b border-gray-200 flex items-center gap-2 md:gap-3 bg-white shrink-0">
                    {/* Back Button - Mobile Only */}
                    {isMobile && (
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors shrink-0"
                        aria-label="Back to conversations"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}
                    {selectedConv?.profileImage ? (
                      <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                        <Image
                          src={selectedConv.profileImage}
                          alt={selectedConv.username}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-gray-200 shrink-0">
                        <span className="text-xs md:text-sm font-semibold text-accent">
                          {selectedConv?.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{selectedConv?.username}</p>
                      <p className="text-xs text-gray-500 truncate hidden md:block">{selectedConv?.email}</p>
                    </div>
                    <Link
                      href={`/user/${selectedConv?.username}`}
                      className="ml-auto text-accent hover:text-primary-hover transition-colors shrink-0"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Link>
                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-3 md:px-6 pt-4 md:pt-6 pb-12 md:pb-16 space-y-4 md:space-y-5 scrollbar-hide bg-gray-50 min-h-0"
                  >
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.senderId._id === user?.id;
                        const isEditing = editingMessageId === message._id;
                        const isDeleting = deletingMessageId === message._id;
                        const isSwiped = swipedMessageId === message._id;
                        const canSwipe = isOwn;
                        const isProjectShare = !!message.projectId;
                        const maxSwipeDistance = 120; // Maximum distance message can move
                        const isActivelySwiping = isMobile && swipeStartX !== null && swipeCurrentX !== null && canSwipe;
                        const swipeOffset = isActivelySwiping
                          ? Math.max(0, Math.min(swipeStartX! - swipeCurrentX!, maxSwipeDistance))
                          : isSwiped && isMobile
                          ? maxSwipeDistance
                          : 0;

                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2 relative overflow-hidden`}
                          >
                            {/* Avatar for received messages */}
                            {!isOwn && (
                              <div className="shrink-0 mb-1">
                                {message.senderId.profileImage ? (
                                  <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-gray-200">
                                    <Image
                                      src={message.senderId.profileImage}
                                      alt={message.senderId.username}
                                      width={36}
                                      height={36}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                                    <span className="text-xs md:text-sm font-semibold text-gray-600">
                                      {message.senderId.username.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Action Buttons - Only appear when swiped */}
                            {canSwipe && (isSwiped || swipeOffset > 40) && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {/* Edit button - only show for text messages */}
                                {!isProjectShare && (
                                  <button
                                    onClick={() => {
                                      handleEditMessage(message);
                                      // Smoothly close swipe
                                      setTimeout(() => {
                                        setSwipedMessageId(null);
                                      }, 150);
                                    }}
                                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center justify-center shadow-lg"
                                    title="Edit message"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                )}
                                {/* Delete button - show for all own messages */}
                                <button
                                  onClick={() => {
                                    handleDeleteClick(message._id);
                                    // Smoothly close swipe after delete confirmation
                                    setTimeout(() => {
                                      setSwipedMessageId(null);
                                    }, 150);
                                  }}
                                  disabled={isDeleting}
                                  className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete message"
                                >
                                  {isDeleting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  ) : (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            )}

                            <div
                              ref={(el) => {
                                if (el) swipeRefs.current.set(message._id, el);
                              }}
                              className={`relative max-w-[85%] md:max-w-[70%] lg:max-w-[60%] ${isOwn ? "order-2" : ""}`}
                              style={{
                                transform: isMobile ? `translateX(-${swipeOffset}px)` : undefined,
                                transition: isMobile && !isActivelySwiping ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                              }}
                              onTouchStart={(e) => isMobile && handleSwipeStart(e, message)}
                              onTouchMove={(e) => isMobile && handleSwipeMove(e, message)}
                              onTouchEnd={(e) => isMobile && handleSwipeEnd(e, message)}
                              onTouchCancel={() => isMobile && handleSwipeCancel()}
                              onContextMenu={(e) => !isMobile && handleRightClick(e, message)}
                            >
                              {/* Message Content */}
                              <div
                                className={`${
                                  isOwn 
                                    ? "bg-accent text-white shadow-md hover:shadow-lg" 
                                    : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md"
                                } rounded-2xl md:rounded-3xl px-4 py-2.5 md:px-5 md:py-3 transition-all duration-200`}
                              >
                                {isEditing ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={editMessageContent}
                                      onChange={(e) => setEditMessageContent(e.target.value)}
                                      className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none text-sm md:text-base"
                                      rows={3}
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.ctrlKey) {
                                          e.preventDefault();
                                          handleSaveEdit();
                                        }
                                        if (e.key === "Escape") {
                                          handleCancelEdit();
                                        }
                                      }}
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleSaveEdit}
                                        disabled={!editMessageContent.trim()}
                                        className="px-3 py-1.5 text-sm bg-white text-accent hover:bg-white/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : message.projectId ? (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <svg
                                        className={`w-4 h-4 ${isOwn ? "text-white/90" : "text-accent"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                      </svg>
                                      <span className={`text-xs font-semibold ${isOwn ? "text-white/90" : "text-gray-600"}`}>
                                        Shared a project
                                      </span>
                                    </div>
                                    <Link
                                      href={`/explore/project/${message.projectId._id}`}
                                      className="block hover:opacity-90 transition-opacity"
                                    >
                                      <div className={`${isOwn ? "bg-white/10" : "bg-gray-50"} rounded-xl p-3 space-y-2 border ${isOwn ? "border-white/20" : "border-gray-200"}`}>
                                        {message.projectId.image && (
                                          <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                            <Image
                                              src={message.projectId.image}
                                              alt={message.projectId.name}
                                              width={300}
                                              height={200}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        )}
                                        <div>
                                          <h4 className={`font-semibold text-sm ${isOwn ? "text-white" : "text-gray-900"}`}>
                                            {message.projectId.name}
                                          </h4>
                                          {message.projectId.description && (
                                            <p className={`text-xs mt-1 line-clamp-2 ${isOwn ? "text-white/80" : "text-gray-600"}`}>
                                              {message.projectId.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                ) : (
                                  <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed break-words">{message.content}</p>
                                )}
                                {!isEditing && (
                                  <p
                                    className={`text-xs mt-2 ${
                                      isOwn ? "text-white/75" : "text-gray-500"
                                    }`}
                                  >
                                    {formatTime(message.createdAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                  </div>


                  {/* Context Menu Dropdown (Desktop only) */}
                  {!isMobile && contextMenu && (
                    <div
                      ref={contextMenuRef}
                      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[180px]"
                      style={{
                        left: `${contextMenu.x}px`,
                        top: `${contextMenu.y}px`,
                        transform: "translateX(-100%)",
                      }}
                    >
                      {(() => {
                        const message = messages.find((m) => m._id === contextMenu.messageId);
                        if (!message) return null;
                        const isProjectShare = !!message.projectId;
                        
                        return (
                          <>
                            {/* Edit option - only show for text messages */}
                            {!isProjectShare && (
                              <>
                                <button
                                  onClick={() => {
                                    handleEditMessage(message);
                                    setContextMenu(null);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                  <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  <span>Edit message</span>
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                              </>
                            )}
                            {/* Delete option - show for all own messages */}
                            <button
                              onClick={() => handleDeleteClick(contextMenu.messageId)}
                              disabled={deletingMessageId === contextMenu.messageId}
                              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingMessageId === contextMenu.messageId ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                  <span>Deleting...</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  <span>Delete message</span>
                                </>
                              )}
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <svg
                              className="w-6 h-6 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">Delete Message</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Are you sure you want to delete this message? This action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={handleDeleteCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteConfirm}
                            disabled={deletingMessageId === showDeleteConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {deletingMessageId === showDeleteConfirm ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Deleting...</span>
                              </>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Selector Modal */}
                  {showProjectSelector && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">Share a Project</h3>
                          <button
                            onClick={() => setShowProjectSelector(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 border-b border-gray-200">
                          <button
                            onClick={() => setProjectSelectorTab("my")}
                            className={`px-4 py-2 font-medium transition-colors ${
                              projectSelectorTab === "my"
                                ? "text-accent border-b-2 border-accent"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            My Projects ({userProjects.length})
                          </button>
                          <button
                            onClick={() => setProjectSelectorTab("bookmarked")}
                            className={`px-4 py-2 font-medium transition-colors ${
                              projectSelectorTab === "bookmarked"
                                ? "text-accent border-b-2 border-accent"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Bookmarked ({bookmarkedProjects.length})
                          </button>
                        </div>

                        {loadingProjects ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                          </div>
                        ) : (
                          <>
                            {projectSelectorTab === "my" ? (
                              userProjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No projects found</p>
                                  <Link
                                    href="/yourprojects/add-project"
                                    className="text-accent hover:text-primary-hover mt-2 inline-block"
                                  >
                                    Create your first project
                                  </Link>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {userProjects.map((project) => (
                                    <button
                                      key={project._id}
                                      onClick={() => handleShareProject(project)}
                                      className="text-left p-4 border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all"
                                    >
                                      {project.image && (
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                                          <Image
                                            src={project.image}
                                            alt={project.name}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                      {project.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                          {project.description}
                                        </p>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )
                            ) : (
                              bookmarkedProjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No bookmarked projects</p>
                                  <Link
                                    href="/explore"
                                    className="text-accent hover:text-primary-hover mt-2 inline-block"
                                  >
                                    Explore projects to bookmark
                                  </Link>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {bookmarkedProjects.map((project) => (
                                    <button
                                      key={project._id}
                                      onClick={() => handleShareProject(project)}
                                      className="text-left p-4 border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all"
                                    >
                                      {project.image && (
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                                          <Image
                                            src={project.image}
                                            alt={project.name}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                      {project.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                          {project.description}
                                        </p>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-2 md:p-4 border-t border-gray-200 bg-white shrink-0">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <button
                        onClick={handleOpenProjectSelector}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-accent transition-colors shrink-0"
                        title="Share a project"
                      >
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-200 rounded-full focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={sendingMessage || (!messageInput.trim() && !showProjectSelector)}
                        className="p-1.5 md:p-2 bg-accent text-white rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {sendingMessage ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`flex-1 flex items-center justify-center text-gray-500 ${isMobile ? "hidden" : ""}`}>
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-lg">Select a conversation to start chatting</p>
                    <p className="text-sm mt-2">Or visit a user&apos;s profile to start a new conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

