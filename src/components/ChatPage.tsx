import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Image, Sparkles, ArrowLeft, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  model?: string;
  timestamp: Date;
}

const aiModels = [
  { id: 'chatgpt', name: 'ChatGPT', color: 'stones-power' },
  { id: 'deepseek', name: 'DeepSeek', color: 'stones-space' },
  { id: 'gemini', name: 'Gemini', color: 'stones-reality' },
  { id: 'claude', name: 'Claude', color: 'stones-soul' },
  { id: 'mistral', name: 'Mistral', color: 'stones-time' },
  { id: 'nvidia-ai', name: 'NVIDIA AI', color: 'stones-mind' }
];

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    searchParams.get('model')?.replace('-', ' ') || 'ChatGPT'
  );
  const [isAdvancedMode, setIsAdvancedMode] = useState(
    searchParams.get('mode') === 'advanced'
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(['ChatGPT']);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI responses (In real implementation, this would call OpenRouter API)
    setTimeout(() => {
      const modelsToRespond = isAdvancedMode ? selectedModels : [selectedModel];
      
      modelsToRespond.forEach((model, index) => {
        setTimeout(() => {
          const aiMessage: Message = {
            id: `ai-${Date.now()}-${index}`,
            content: `This is a simulated response from ${model}. In the full implementation, this would be powered by the OpenRouter API with your provided key. The response would be contextual and helpful based on your question: "${inputValue}"`,
            role: 'assistant',
            model: model,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }, index * 1000);
      });
      
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
    if (!isAdvancedMode) {
      setSelectedModels([selectedModel]);
    }
  };

  const toggleModelSelection = (modelName: string) => {
    if (selectedModels.includes(modelName)) {
      setSelectedModels(prev => prev.filter(m => m !== modelName));
    } else {
      setSelectedModels(prev => [...prev, modelName]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="glass-card border-b border-glass-border/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={isAdvancedMode ? "hero" : "outline"}
              onClick={toggleAdvancedMode}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Advanced Mode
            </Button>
            
            {!isAdvancedMode && (
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48 glass-card border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border">
                  {aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </header>

      {/* Advanced Mode Model Selection */}
      {isAdvancedMode && (
        <div className="glass-card border-b border-glass-border/50 p-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Select multiple AI models to compare responses:</p>
            <div className="flex flex-wrap gap-2">
              {aiModels.map((model) => (
                <Badge
                  key={model.id}
                  variant={selectedModels.includes(model.name) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedModels.includes(model.name) ? 'glow-primary' : ''
                  }`}
                  onClick={() => toggleModelSelection(model.name)}
                >
                  {model.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Notice */}
      <div className="glass-card border-b border-glass-border/50 p-3 bg-primary/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Never lose your chats with Thanos AI – save them via login.{" "}
            <span className="text-primary font-medium cursor-pointer hover:underline">
              Connect Supabase to enable authentication
            </span>
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <main className="flex-1 max-w-6xl mx-auto p-4 pb-24">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-infinity opacity-20 animate-pulse-glow" />
                <h3 className="text-2xl font-semibold mb-2 text-gradient">
                  Ready to harness infinite AI power?
                </h3>
                <p className="text-muted-foreground">
                  Ask anything and get {isAdvancedMode ? 'multiple perspectives' : 'intelligent responses'} 
                  from cutting-edge AI models.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card text-foreground'
                  }`}
                >
                  {message.model && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {message.model}
                      </Badge>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-card p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="text-sm text-muted-foreground ml-2">AI thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 glass-card border-t border-glass-border/50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Image className="w-3 h-3" />
                  Image Upload
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Generate Image
                </Button>
              </div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything... harness the power of AI"
                className="glass-card border-glass-border text-lg py-3 px-4"
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              variant="hero"
              size="lg"
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;