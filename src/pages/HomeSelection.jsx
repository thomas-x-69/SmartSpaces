// src/pages/HomeSelection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ChevronRight, Maximize2, Grid3X3 } from "lucide-react";

const HomeOption = ({
  title,
  description,
  features,
  icon: Icon,
  gradient,
  onClick,
  isSelected,
}) => (
  <div
    className={`relative group cursor-pointer transition-all duration-500 ${
      isSelected ? "scale-105" : "hover:scale-102"
    }`}
    onClick={onClick}
  >
    <div
      className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
        isSelected
          ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-2xl"
          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
      }`}
    >
      {/* Background Animation */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: gradient }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-xl ${
                isSelected ? "bg-blue-500/20" : "bg-white/10"
              }`}
            >
              <Icon
                className={`w-8 h-8 ${
                  isSelected ? "text-blue-400" : "text-white"
                }`}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
              <p className="text-white/70">{description}</p>
            </div>
          </div>
          <ChevronRight
            className={`w-6 h-6 transition-transform duration-300 ${
              isSelected
                ? "text-blue-400 translate-x-1"
                : "text-white/50 group-hover:translate-x-1"
            }`}
          />
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  isSelected ? "bg-blue-400" : "bg-white/50"
                }`}
              />
              <span className="text-white/80">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HomeSelection = () => {
  const navigate = useNavigate();
  const [selectedHome, setSelectedHome] = useState(null);

  const homeOptions = [
    {
      id: "50m",
      title: "50M² Smart Home",
      description: "Compact & Efficient Living",
      icon: Home,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      features: [
        "5 Optimized Rooms (Bedroom, Living Room, Kitchen, Bathroom, Lobby)",
        "Intelligent Space Utilization",
        "Perfect for Small Families",
        "Dynamic Room Adjustment",
        "Smart Furniture Placement",
      ],
    },
    {
      id: "100m",
      title: "100M² Smart Home",
      description: "Spacious & Luxurious Living",
      icon: Maximize2,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      features: [
        "8 Spacious Rooms (Kitchen, Bathroom, Inventory, Room1, Living Room, Lobby, Room2, Room3)",
        "Extended Living Areas",
        "Ideal for Large Families",
        "Multiple Private Spaces",
        "Advanced Room Configuration",
      ],
    },
  ];

  const handleSelect = (homeId) => {
    setSelectedHome(homeId);
    setTimeout(() => {
      navigate(`/designer/${homeId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-white/20 rounded-full animate-firefly"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Grid3X3 size={40} className="text-blue-500 animate-float" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4 animate-title">
            Choose Your Smart Home
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-subtitle">
            Select the perfect living space that matches your lifestyle and
            needs
          </p>
        </div>

        {/* Home Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">
          {homeOptions.map((option) => (
            <HomeOption
              key={option.id}
              {...option}
              onClick={() => handleSelect(option.id)}
              isSelected={selectedHome === option.id}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-lg">
            Click on your preferred home type to start designing your smart
            living space
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSelection;
