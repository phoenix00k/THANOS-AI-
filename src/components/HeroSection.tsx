import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import thanosGauntletHero from "@/assets/thanos-gauntlet-hero.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/chat");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${thanosGauntletHero})`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/20 to-background/60" />
      
      {/* Floating Gauntlet Animation */}
      <div className="absolute z-20 animate-float opacity-30">
        <div className="w-96 h-96 rounded-full bg-gradient-infinity opacity-20 blur-3xl animate-infinity-glow" />
      </div>
      
      {/* Content */}
      <div className="relative z-30 text-center px-6 max-w-5xl mx-auto">
        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
          <span className="text-gradient">Thanos AI</span>
        </h1>
        
        {/* Subtitle */}
        <div className="text-2xl md:text-4xl font-semibold mb-4 text-foreground">
          <span className="text-stones-power">6 Minds.</span>{" "}
          <span className="text-stones-space">1 Question.</span>{" "}
          <span className="text-stones-reality">Infinite Power.</span>
        </div>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Ask anything. Get multiple AI perspectives. Choose your power.
        </p>
        
        {/* Infinity Stones Visual */}
        <div className="flex justify-center items-center gap-4 mb-12">
          {[
            { color: "stones-power", glow: "shadow-[0_0_30px_#8B5CF6]" },
            { color: "stones-space", glow: "shadow-[0_0_30px_#3B82F6]" },
            { color: "stones-reality", glow: "shadow-[0_0_30px_#EF4444]" },
            { color: "stones-soul", glow: "shadow-[0_0_30px_#C084FC]" },
            { color: "stones-time", glow: "shadow-[0_0_30px_#06B6D4]" },
            { color: "stones-mind", glow: "shadow-[0_0_30px_#F97316]" }
          ].map((stone, index) => (
            <div
              key={index}
              className={`w-4 h-4 md:w-6 md:h-6 rounded-full bg-${stone.color} ${stone.glow} animate-pulse-glow`}
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
        </div>
        
        {/* CTA Button */}
        <Button 
          variant="infinity" 
          size="xl" 
          onClick={handleGetStarted}
          className="text-xl px-12 py-6"
        >
          Get Started
        </Button>
        
        {/* Subtle hint text */}
        <p className="text-sm text-muted-foreground/70 mt-8">
          Harness the power of multiple AI models in one place
        </p>
      </div>
    </section>
  );
};

export default HeroSection;