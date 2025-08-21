import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, Cpu, Zap, MessageSquare, Bot, Microchip } from "lucide-react";

const aiModels = [
  {
    name: "ChatGPT",
    description: "OpenAI's flagship conversational AI with exceptional reasoning and creativity",
    color: "stones-power",
    icon: MessageSquare,
    bgGradient: "from-purple-600/20 to-purple-900/20",
    borderColor: "border-purple-500/30",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
  },
  {
    name: "DeepSeek",
    description: "Advanced reasoning model with deep analytical capabilities",
    color: "stones-space",
    icon: Brain,
    bgGradient: "from-cyan-600/20 to-cyan-900/20",
    borderColor: "border-cyan-500/30",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
  },
  {
    name: "Gemini",
    description: "Google's multimodal AI with excellent vision and language understanding",
    color: "stones-reality",
    icon: Zap,
    bgGradient: "from-red-600/20 to-red-900/20",
    borderColor: "border-red-500/30",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
  },
  {
    name: "Claude",
    description: "Anthropic's helpful and harmless AI with strong ethical reasoning",
    color: "stones-soul",
    icon: Bot,
    bgGradient: "from-orange-600/20 to-orange-900/20",
    borderColor: "border-orange-500/30",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]"
  },
  {
    name: "Mistral",
    description: "Efficient European AI model with multilingual capabilities",
    color: "stones-time",
    icon: Cpu,
    bgGradient: "from-green-600/20 to-green-900/20",
    borderColor: "border-green-500/30",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
  },
  {
    name: "NVIDIA AI",
    description: "Cutting-edge AI models optimized for performance and accuracy",
    color: "stones-mind",
    icon: Microchip,
    bgGradient: "from-yellow-600/20 to-yellow-900/20",
    borderColor: "border-yellow-500/30",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]"
  }
];

const AIModelsSection = () => {
  const navigate = useNavigate();

  const handleModelSelect = (modelName: string) => {
    navigate(`/chat?model=${modelName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <section className="py-20 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background opacity-90" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-primary-gradient">Choose Your</span>{" "}
            <span className="text-gradient">AI Power</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each AI model brings unique strengths. Select one for focused responses, 
            or combine multiple minds for comprehensive insights.
          </p>
        </div>

        {/* AI Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {aiModels.map((model, index) => {
            const IconComponent = model.icon;
            return (
              <Card 
                key={model.name}
                className={`glass-card ${model.borderColor} ${model.hoverShadow} transform hover:scale-105 transition-all duration-300 cursor-pointer group bg-gradient-to-br ${model.bgGradient} backdrop-blur-card`}
                onClick={() => handleModelSelect(model.name)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${model.color}/20 flex items-center justify-center group-hover:bg-${model.color}/30 transition-colors`}>
                    <IconComponent className={`w-8 h-8 text-${model.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {model.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center leading-relaxed">
                    {model.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Advanced Mode CTA */}
        <div className="text-center">
          <div className="glass-card border-primary/30 p-8 rounded-2xl max-w-2xl mx-auto mb-8">
            <h3 className="text-3xl font-bold mb-4 text-gradient">
              Advanced Mode
            </h3>
            <p className="text-muted-foreground mb-6">
              Select multiple AI models and compare their responses side by side. 
              Get diverse perspectives on any question with the power of combined intelligence.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/chat?mode=advanced")}
              className="text-lg px-8"
            >
              Try Advanced Mode
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIModelsSection;