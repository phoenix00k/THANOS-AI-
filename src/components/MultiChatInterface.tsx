import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Settings, ArrowLeft, Key, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  model?: string;
  timestamp: Date;
  loading?: boolean;
}

interface ChatSession {
  modelId: string;
  modelName: string;
  messages: Message[];
  color: string;
}

const aiModels = [
  { id: 'gpt-4', name: 'ChatGPT-4', color: 'stones-power', openRouterModel: 'openai/gpt-4' },
  { id: 'gpt-3.5-turbo', name: 'ChatGPT-3.5', color: 'stones-space', openRouterModel: 'openai/gpt-3.5-turbo' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', color: 'stones-reality', openRouterModel: 'anthropic/claude-3-sonnet' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', color: 'stones-soul', openRouterModel: 'anthropic/claude-3-haiku' },
  { id: 'gemini-pro', name: 'Gemini Pro', color: 'stones-time', openRouterModel: 'google/gemini-pro' },
  { id: 'mistral-large', name: 'Mistral Large', color: 'stones-mind', openRouterModel: 'mistralai/mistral-large' }
];

const MultiChatInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [apiKey, setApiKey] = useState("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");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([
    { 
      modelId: 'gpt-4', 
      modelName: 'ChatGPT-4', 
      messages: [], 
      color: 'stones-power' 
    }
  ]);
  const [activeTab, setActiveTab] = useState('gpt-4');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSessions]);

  const addModelSession = (model: typeof aiModels[0]) => {
    if (activeSessions.find(session => session.modelId === model.id)) {
      toast({
        title: "Model already active",
        description: `${model.name} is already in your chat session.`,
      });
      return;
    }

    const newSession: ChatSession = {
      modelId: model.id,
      modelName: model.name,
      messages: [],
      color: model.color
    };

    setActiveSessions(prev => [...prev, newSession]);
    setActiveTab(model.id);
    
    toast({
      title: "Model added",
      description: `${model.name} has been added to your chat session.`,
    });
  };

  const removeModelSession = (modelId: string) => {
    if (activeSessions.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one model active.",
        variant: "destructive"
      });
      return;
    }

    setActiveSessions(prev => prev.filter(session => session.modelId !== modelId));
    
    if (activeTab === modelId) {
      setActiveTab(activeSessions[0].modelId);
    }
  };

  const callOpenRouterAPI = async (model: string, messages: Message[]) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Thanos AI'
        },
        body: JSON.stringify({
          model: model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response received";
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!apiKey.trim()) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenRouter API key to continue.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message to all active sessions
    setActiveSessions(prev => 
      prev.map(session => ({
        ...session,
        messages: [...session.messages, userMessage]
      }))
    );

    const currentInput = inputValue;
    setInputValue("");

    // Add loading messages for all models
    const loadingMessages: { [key: string]: Message } = {};
    activeSessions.forEach(session => {
      const loadingId = `loading-${session.modelId}-${Date.now()}`;
      loadingMessages[session.modelId] = {
        id: loadingId,
        content: "",
        role: 'assistant',
        model: session.modelName,
        timestamp: new Date(),
        loading: true
      };
    });

    setActiveSessions(prev => 
      prev.map(session => ({
        ...session,
        messages: [...session.messages, loadingMessages[session.modelId]]
      }))
    );

    // Get responses from all models
    const promises = activeSessions.map(async (session) => {
      try {
        const model = aiModels.find(m => m.id === session.modelId);
        if (!model) throw new Error('Model not found');

        const allMessages = [...session.messages, userMessage];
        const response = await callOpenRouterAPI(model.openRouterModel, allMessages);

        const aiMessage: Message = {
          id: `ai-${session.modelId}-${Date.now()}`,
          content: response,
          role: 'assistant',
          model: session.modelName,
          timestamp: new Date()
        };

        return { sessionId: session.modelId, message: aiMessage };
      } catch (error) {
        const errorMessage: Message = {
          id: `error-${session.modelId}-${Date.now()}`,
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          role: 'assistant',
          model: session.modelName,
          timestamp: new Date()
        };
        
        return { sessionId: session.modelId, message: errorMessage };
      }
    });

    try {
      const results = await Promise.all(promises);
      
      setActiveSessions(prev => 
        prev.map(session => {
          const result = results.find(r => r.sessionId === session.modelId);
          if (result) {
            return {
              ...session,
              messages: session.messages.filter(m => !m.loading).concat(result.message)
            };
          }
          return session;
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get responses from AI models.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentSession = () => {
    return activeSessions.find(session => session.modelId === activeTab) || activeSessions[0];
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="glass-card border-b border-glass-border/50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Thanos AI</h1>
            <Badge variant="outline" className="text-xs">
              {activeSessions.length} Models Active
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="gap-2"
            >
              <Key className="w-4 h-4" />
              API Key
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <div className="max-w-7xl mx-auto mt-4 p-4 glass-card rounded-lg">
            <div className="flex items-center gap-4">
              <Input
                type="password"
                placeholder="Enter your OpenRouter API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => setShowApiKeyInput(false)}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your API key is stored locally and used to authenticate with OpenRouter.
            </p>
          </div>
        )}
      </header>

      {/* Available Models */}
      <div className="glass-card border-b border-glass-border/50 p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground mb-3">Available AI Models:</p>
          <div className="flex flex-wrap gap-2">
            {aiModels.map((model) => {
              const isActive = activeSessions.find(session => session.modelId === model.id);
              return (
                <Badge
                  key={model.id}
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isActive ? 'glow-primary' : ''
                  }`}
                  onClick={() => isActive ? removeModelSession(model.id) : addModelSession(model)}
                >
                  {model.name} {isActive && '✓'}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <main className="flex-1 max-w-7xl mx-auto p-4 pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="glass-card p-1 mb-4">
            {activeSessions.map((session) => (
              <TabsTrigger 
                key={session.modelId} 
                value={session.modelId}
                className="relative"
              >
                {session.modelName}
                {activeSessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeModelSession(session.modelId);
                    }}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeSessions.map((session) => (
            <TabsContent key={session.modelId} value={session.modelId} className="h-full">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-4">
                  {session.messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${session.color}/20 animate-pulse-glow`} />
                      <h3 className="text-xl font-semibold mb-2">
                        Chat with {session.modelName}
                      </h3>
                      <p className="text-muted-foreground">
                        Start a conversation with this AI model
                      </p>
                    </div>
                  )}

                  {session.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <Card
                        className={`max-w-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-card'
                        }`}
                      >
                        <CardContent className="p-4">
                          {message.model && (
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {message.model}
                              </Badge>
                            </div>
                          )}
                          {message.loading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          )}
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 glass-card border-t border-glass-border/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything to your active AI models..."
                className="glass-card border-glass-border text-lg py-6 px-4"
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim()}
              variant="hero"
              size="lg"
              className="gap-2 py-6"
            >
              <Send className="w-4 h-4" />
              Send to All
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your message will be sent to all {activeSessions.length} active model{activeSessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MultiChatInterface;