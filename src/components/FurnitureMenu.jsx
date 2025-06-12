// src/components/furniture/FurnitureMenu.jsx
import { useState, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  ArrowLeftFromLine,
} from "lucide-react";

const FURNITURE_CATEGORIES = {
  "Living Room": {
    items: [
      { id: "Sofa_Leather", name: "Leather Sofa" },
      { id: "Sofa_Modern", name: "Modern Sofa" },
      { id: "Sofa_Simple", name: "Simple Sofa" },
      { id: "armchair-very-big", name: "armchair-very-big" },
      { id: "ArmChair_Leather", name: "Leather Armchair" },
      { id: "Chair_Leather", name: "Leather Chair" },
      // { id: "tv_wall", name: "TV Wall Unit" },
      { id: "Table_Modern", name: "Modern Table" },
      { id: "Table_Modern2", name: "Modern Table Style 2" },
      { id: "Table_Small", name: "Small Table" },
      { id: "armchair-004", name: "Armchair 004" },
      { id: "armchair-019", name: "Armchair 019" },
      { id: "armchair-021", name: "Armchair 021" },
      { id: "armchair-022", name: "Armchair 022" },
      { id: "armchair-023", name: "Armchair 023" },
      { id: "armchair-025", name: "Armchair 025" },
      { id: "bean-bag-chair-010", name: "Bean Bag Chair" },
      // { id: "bed-001", name: "Bed 001" },
      // { id: "bed-003", name: "Bed 003" },
      { id: "bookcase-004", name: "Bookcase" },
    ],
    icon: "🛋️",
  },
  Bedroom: {
    items: [
      // { id: "Bed_Modern", name: "Modern Bed" },
      { id: "bed_Small", name: "Small Bed" },
      // { id: "dresser", name: "Dresser" },
      { id: "Drawer", name: "Basic Drawer" },
      { id: "Drawer_Modern", name: "Modern Drawer" },
      // { id: "closet", name: "Closet" },
    ],
    icon: "🛏️",
  },
  Kitchen: {
    items: [
      // { id: "Kitchen_table", name: "Kitchen Table" },
      { id: "chair_Kitchen", name: "Kitchen Chair" },
      // { id: "Sink_Kitchen", name: "Kitchen Sink" },
      // { id: "fridge", name: "Refrigerator" },
      { id: "Oven", name: "Oven" },
    ],
    icon: "🍳",
  },
  Bathroom: {
    items: [
      { id: "Toilet", name: "toilet" },
      { id: "washing_machine", name: "Washing Machine" },
    ],
    icon: "🚿",
  },
  Office: {
    items: [{ id: "Table_Office", name: "Office Table" }],
    icon: "💼",
  },
  additional: {
    items: [
      // { id: "chair-009", name: "Chair 009" },
      { id: "chair-046", name: "Chair 046" },
      // { id: "child-bed-001", name: "Child Bed" },
      { id: "children-rocking-chair-001", name: "Children Rocking Chair" },
      { id: "coffee-table-030", name: "Coffee Table" },
      // { id: "commode-001", name: "Commode" },
      { id: "contemporary-sofa-001", name: "Contemporary Sofa" },
      { id: "easy-chair-002", name: "Easy Chair" },
      { id: "folding-chair-002", name: "Folding Chair" },
      { id: "kids-chair-005", name: "Kids Chair" },
      { id: "kids-stool-001", name: "Kids Stool" },
      { id: "kids-table-001", name: "Kids Table" },
      { id: "nightstand-005", name: "Nightstand" },
      { id: "night-table-013", name: "Night Table" },
      { id: "rocking-chair-003", name: "Rocking Chair" },
      { id: "sideboard-012", name: "Sideboard" },
      // { id: "sofa-006", name: "Sofa 006" },
      // { id: "sofa-036", name: "Sofa 036" },
      // { id: "sofa-040", name: "Sofa 040" },
    ],
    icon: "🪑",
  },
};

const FurnitureItem = ({ item, onSelect }) => {
  return (
    <div
      className="group p-3 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 
                 hover:bg-white/20 transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(item.id)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("furniture", item.id);
        onSelect(item.id);
      }}
    >
      <h3 className="text-white/90 font-medium text-sm">{item.name}</h3>
    </div>
  );
};

const FurnitureCategory = ({
  name,
  items,
  icon,
  isExpanded,
  onToggle,
  onSelect,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-white/90 
                   hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium">{name}</span>
          <span className="text-sm text-white/50">({items.length})</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-white/50" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white/50" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 gap-2">
          {items.map((item) => (
            <FurnitureItem key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const FurnitureMenu = ({ onFurnitureSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("Living Room");
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <>
      {/* Add Furniture Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed left-4 top-4 z-20 bg-gradient-to-r from-blue-500 to-cyan-500 
                   text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl 
                   transition-all duration-300 hover:scale-105 active:scale-95
                   ${
                     isExpanded
                       ? "opacity-0 pointer-events-none"
                       : "opacity-100"
                   }`}
      >
        Add Furniture
      </button>

      {/* Menu Panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-80 bg-black/30 backdrop-blur-2xl 
                   text-white shadow-2xl flex flex-col border-r border-white/10
                   transition-all duration-300 ease-in-out
                   ${isExpanded ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              Furniture Library
            </h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeftFromLine className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search furniture..."
              className="w-full bg-white/10 rounded-xl px-4 py-2 pl-10 pr-10 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     placeholder-white/30 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-white/30 hover:text-white/50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {Object.entries(FURNITURE_CATEGORIES).map(([name, category]) => (
            <FurnitureCategory
              key={name}
              name={name}
              items={category.items.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              icon={category.icon}
              isExpanded={expandedCategory === name}
              onToggle={() =>
                setExpandedCategory(expandedCategory === name ? null : name)
              }
              onSelect={onFurnitureSelect}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-sm text-white/50 text-center">
            Drag and drop furniture into the scene
          </p>
        </div>
      </div>
    </>
  );
};

export default FurnitureMenu;
