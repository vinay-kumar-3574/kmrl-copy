import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  AtSign, 
  FileText, 
  Users, 
  Clock, 
  Pin,
  Reply,
  MoreVertical,
  Plus,
  Bell,
  Eye,
  MessageCircle,
  User
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Collaboration = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState("general");

  const discussions = [
    {
      id: "general",
      title: "General Discussion",
      participants: 12,
      lastActivity: "2 minutes ago",
      unreadCount: 3,
      description: "General sector discussions and updates"
    },
    {
      id: "safety-protocols",
      title: "Safety Protocol Updates",
      participants: 8,
      lastActivity: "15 minutes ago",
      unreadCount: 1,
      description: "Discussing new safety protocol implementations"
    },
    {
      id: "budget-review",
      title: "Q1 Budget Review",
      participants: 6,
      lastActivity: "1 hour ago",
      unreadCount: 0,
      description: "Quarterly budget analysis and planning"
    },
    {
      id: "vendor-evaluation",
      title: "Vendor Evaluation Process",
      participants: 10,
      lastActivity: "2 hours ago",
      unreadCount: 5,
      description: "Evaluating new vendor proposals and contracts"
    }
  ];

  const messages = [
    {
      id: 1,
      author: "Arjun Nair",
      avatar: "/placeholder.svg",
      time: "10:30 AM",
      content: "I've updated the safety protocol document. Please review the emergency evacuation procedures section.",
      mentions: ["@all"],
      replies: 2,
      attachments: [
        { name: "Safety_Protocol_v2.3.pdf", size: "2.4 MB" }
      ]
    },
    {
      id: 2,
      author: "Priya Menon",
      avatar: "/placeholder.svg",
      time: "10:25 AM",
      content: "The budget allocation for Q2 looks good. @Rajesh Kumar, can you confirm the procurement estimates?",
      mentions: ["@Rajesh Kumar"],
      replies: 1,
      attachments: []
    },
    {
      id: 3,
      author: "Meera Pillai",
      avatar: "/placeholder.svg",
      time: "10:20 AM",
      content: "സുരക്ഷാ നിർദ്ദേശങ്ങൾ മലയാളത്തിൽ തയ്യാറാക്കി. ദയവായി അവലോകനം ചെയ്യുക.",
      mentions: [],
      replies: 0,
      attachments: [
        { name: "Safety_Guidelines_Malayalam.pdf", size: "1.8 MB" }
      ]
    },
    {
      id: 4,
      author: "Rajesh Kumar",
      avatar: "/placeholder.svg",
      time: "10:15 AM",
      content: "@Priya Menon Yes, the procurement estimates are accurate. I'll have the detailed breakdown ready by EOD.",
      mentions: ["@Priya Menon"],
      replies: 0,
      attachments: []
    }
  ];

  const activeCollaborations = [
    {
      id: 1,
      document: "Metro Safety Manual 2024",
      collaborators: ["Arjun Nair", "Meera Pillai", "Suresh Babu"],
      lastUpdate: "30 minutes ago",
      status: "In Progress",
      comments: 8
    },
    {
      id: 2,
      document: "Q1 Financial Report",
      collaborators: ["Priya Menon", "Anitha Raj"],
      lastUpdate: "1 hour ago",
      status: "Under Review",
      comments: 12
    },
    {
      id: 3,
      document: "Vendor Agreement Template",
      collaborators: ["Rajesh Kumar", "Suresh Babu", "Anitha Raj"],
      lastUpdate: "2 hours ago",
      status: "Approved",
      comments: 5
    }
  ];

  const mentions = [
    {
      id: 1,
      author: "Priya Menon",
      message: "@You mentioned in budget discussion",
      time: "5 minutes ago",
      context: "Q1 Budget Review",
      read: false
    },
    {
      id: 2,
      author: "Arjun Nair",
      message: "@You tagged in safety protocol update",
      time: "1 hour ago",
      context: "Safety Protocol Updates",
      read: false
    },
    {
      id: 3,
      author: "Rajesh Kumar",
      message: "@You mentioned in vendor discussion",
      time: "3 hours ago",
      context: "Vendor Evaluation Process",
      read: true
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending logic here
      setNewMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Collaboration Center
          </h1>
          <p className="text-muted-foreground">
            Real-time discussions, document collaboration, and team communication across departments.
          </p>
        </div>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Discussion List */}
              <div className="lg:col-span-1">
                <Card className="kmrl-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Discussions</CardTitle>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        New
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {discussions.map((discussion) => (
                        <div
                          key={discussion.id}
                          className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedChat === discussion.id ? "bg-primary/10 border-r-2 border-primary" : ""
                          }`}
                          onClick={() => setSelectedChat(discussion.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm text-card-foreground truncate">
                              {discussion.title}
                            </h4>
                            {discussion.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {discussion.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{discussion.participants}</span>
                            </div>
                            <span>{discussion.lastActivity}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {discussion.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="kmrl-card h-[600px] flex flex-col">
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {discussions.find(d => d.id === selectedChat)?.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {discussions.find(d => d.id === selectedChat)?.participants} participants
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Pin className="w-4 h-4 mr-1" />
                          Pin
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="w-4 h-4 mr-1" />
                          Notify
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              View Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Shared Files
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Chat Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar} alt={message.author} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {message.author.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm text-card-foreground">
                                {message.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {message.time}
                              </span>
                              {message.mentions.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <AtSign className="w-3 h-3 mr-1" />
                                  {message.mentions.length}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-card-foreground leading-relaxed">
                              {message.content}
                            </p>

                            {message.attachments.length > 0 && (
                              <div className="space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded border">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-card-foreground">
                                      {attachment.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {attachment.size}
                                    </span>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-xs h-6">
                                <Reply className="w-3 h-3 mr-1" />
                                Reply ({message.replies})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs h-6">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Thread
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t border-border p-4">
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your message... Use @ to mention someone"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" onClick={handleSendMessage}>
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Press Enter to send, Shift+Enter for new line</span>
                        <span>Supports English and Malayalam</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="kmrl-card">
              <CardHeader>
                <CardTitle>Active Document Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCollaborations.map((collab) => (
                    <div key={collab.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-card-foreground">
                          {collab.document}
                        </h3>
                        <Badge 
                          className={
                            collab.status === "Approved" ? "bg-success/10 text-success" :
                            collab.status === "Under Review" ? "bg-warning/10 text-warning" :
                            "bg-primary/10 text-primary"
                          }
                        >
                          {collab.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex -space-x-2">
                          {collab.collaborators.map((collaborator, index) => (
                            <Avatar key={index} className="w-8 h-8 border-2 border-background">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {collaborator.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {collab.collaborators.length} collaborators
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Updated {collab.lastUpdate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{collab.comments} comments</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentions" className="space-y-6">
            <Card className="kmrl-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AtSign className="w-5 h-5" />
                  <span>Your Mentions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mentions.map((mention) => (
                    <div 
                      key={mention.id} 
                      className={`p-4 border rounded-lg transition-colors hover:bg-muted/30 ${
                        !mention.read ? "border-primary/50 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-primary" />
                            <span className="font-medium text-card-foreground">
                              {mention.author}
                            </span>
                            {!mention.read && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-card-foreground">
                            {mention.message}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>in {mention.context}</span>
                            <span>{mention.time}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="kmrl-card">
                <CardHeader>
                  <CardTitle className="text-lg">Engineering Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Members</span>
                      <Badge>12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Online Now</span>
                      <Badge className="bg-success/10 text-success">8</Badge>
                    </div>
                    <Button className="w-full mt-4">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="kmrl-card">
                <CardHeader>
                  <CardTitle className="text-lg">Finance Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Members</span>
                      <Badge>8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Online Now</span>
                      <Badge className="bg-success/10 text-success">5</Badge>
                    </div>
                    <Button className="w-full mt-4">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="kmrl-card">
                <CardHeader>
                  <CardTitle className="text-lg">Procurement Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Members</span>
                      <Badge>10</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Online Now</span>
                      <Badge className="bg-success/10 text-success">7</Badge>
                    </div>
                    <Button className="w-full mt-4">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Collaboration;