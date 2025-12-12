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
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
            // Check if conversation exists, if not create it by selecting it
            const convExists = data.data.some((c: Conversation) => c.userId === userIdParam);
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

  // Fetch user projects for sharing
  const fetchUserProjects = async () => {
    setLoadingProjects(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.ok) {
        setUserProjects(data.data || []);
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

  const handleOpenProjectSelector = () => {
    setShowProjectSelector(true);
    if (userProjects.length === 0) {
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-140px)] flex flex-col">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loadingConversations ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">Start chatting with other users!</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv.userId)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation === conv.userId ? "bg-accent/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {conv.profileImage ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                            <Image
                              src={conv.profileImage}
                              alt={conv.username}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-gray-200 shrink-0">
                            <span className="text-lg font-semibold text-accent">
                              {conv.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-gray-900 truncate">{conv.username}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5 shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage.projectId
                              ? `Shared: ${conv.lastMessage.projectId.name}`
                              : conv.lastMessage.content || "No message"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
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
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    {selectedConv?.profileImage ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                          src={selectedConv.profileImage}
                          alt={selectedConv.username}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-gray-200">
                        <span className="text-sm font-semibold text-accent">
                          {selectedConv?.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{selectedConv?.username}</p>
                      <p className="text-xs text-gray-500">{selectedConv?.email}</p>
                    </div>
                    <Link
                      href={`/user/${selectedConv?.username}`}
                      className="ml-auto text-accent hover:text-primary-hover transition-colors"
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
                    className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50"
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
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] md:max-w-[60%] ${
                                isOwn ? "bg-accent text-white" : "bg-white text-gray-900"
                              } rounded-2xl px-4 py-2 shadow-sm`}
                            >
                              {message.projectId ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    <svg
                                      className={`w-4 h-4 ${isOwn ? "text-white" : "text-accent"}`}
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
                                    <span className="text-xs font-semibold opacity-80">
                                      Shared a project
                                    </span>
                                  </div>
                                  <Link
                                    href={`/explore/project/${message.projectId._id}`}
                                    className="block hover:opacity-90 transition-opacity"
                                  >
                                    <div className="bg-black/10 rounded-lg p-3 space-y-2">
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
                                        <h4 className="font-semibold text-sm">
                                          {message.projectId.name}
                                        </h4>
                                        {message.projectId.description && (
                                          <p className="text-xs opacity-80 line-clamp-2 mt-1">
                                            {message.projectId.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              ) : (
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              )}
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? "text-white/70" : "text-gray-400"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

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
                        {loadingProjects ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                          </div>
                        ) : userProjects.length === 0 ? (
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
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenProjectSelector}
                        className="p-2 text-gray-400 hover:text-accent transition-colors"
                        title="Share a project"
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
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={sendingMessage || (!messageInput.trim() && !showProjectSelector)}
                        className="p-2 bg-accent text-white rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="flex-1 flex items-center justify-center text-gray-500">
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
                    <p className="text-sm mt-2">Or visit a user's profile to start a new conversation</p>
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

