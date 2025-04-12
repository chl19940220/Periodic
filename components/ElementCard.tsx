'use client';

import { Element } from '../types/element';
import { useEffect, useRef, useState } from 'react';

interface ElementCardProps {
  element: Element;
}

const ElementCard: React.FC<ElementCardProps> = ({ element }) => {
  const [tooltipPosition, setTooltipPosition] = useState<'center' | 'left' | 'right'>('center');
  const cardRef = useRef<HTMLDivElement>(null);

  const formatValue = (value: number | undefined, unit: string = ''): string => {
    if (value === undefined) return '暂无数据';
    return `${value}${unit}`;
  };

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // 计算卡片中心到视口左右边缘的距离
      const distanceToLeft = rect.left + rect.width / 2;
      const distanceToRight = viewportWidth - (rect.left + rect.width / 2);
      
      // tooltip 的一半宽度 (320px / 2 = 160px)
      const tooltipWidth = 320;
      const buffer = 10; // Small buffer from viewport edges

      // Calculate the card's center position
      const cardCenter = rect.left + rect.width / 2;

      // Check if centering the tooltip would push it off the left edge
      if (cardCenter - tooltipWidth / 2 < buffer) {
        setTooltipPosition('left');
      // Check if centering the tooltip would push it off the right edge
      } else if (cardCenter + tooltipWidth / 2 > viewportWidth - buffer) {
        setTooltipPosition('right');
      // Otherwise, centering should fit within the viewport
      } else {
        setTooltipPosition('center');
      }
    };

    // 初始化时更新位置
    updateTooltipPosition();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateTooltipPosition);
    
    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, []);

  const getTooltipPositionClasses = () => {
    const baseClasses = "absolute z-50 hidden group-hover:block bg-white dark:bg-gray-800 text-sm border rounded-lg shadow-lg p-4 w-80";
    const verticalPosition = (element.period > 5) ? 'bottom-full mb-2' : 'mt-2'; // Position above for period > 5
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Approximate height of the tooltip
    const cardRefRect = cardRef.current?.getBoundingClientRect();
    const isAbove = element.period > 5;
    let horizontalClass = '-translate-x-1/2 left-1/2'; // Default to center
    if (tooltipPosition === 'left') {
      horizontalClass = 'left-0';
    } else if (tooltipPosition === 'right') {
      horizontalClass = 'right-0';
    }
    // Check if the tooltip goes off-screen above
    if (isAbove && cardRefRect && cardRefRect.top - tooltipHeight < 0) {
      // If it goes off-screen above, position it below
      return `${baseClasses} ${horizontalClass} mt-2`;
    }

    return `${baseClasses} ${horizontalClass} ${verticalPosition}`;
  };

  const getTooltipArrowClasses = () => {
    const isAbove = element.period > 5;
    const verticalPositionClass = isAbove ? 'bottom-[-8px]' : '-top-2'; // Arrow at bottom if tooltip is above
    const borderClass = isAbove 
      ? 'border-t-8 border-l-8 border-r-8 border-t-white dark:border-t-gray-800 border-l-transparent border-r-transparent' // Pointing down
      : 'border-b-8 border-l-8 border-r-8 border-b-white dark:border-b-gray-800 border-l-transparent border-r-transparent'; // Pointing up
    const baseClasses = `absolute w-0 h-0 ${verticalPositionClass} ${borderClass}`;
    
    switch (tooltipPosition) {
      case 'left':
        return `${baseClasses} left-4`;
      case 'right':
        return `${baseClasses} right-4`;
      default: // center
        return `${baseClasses} left-1/2 -translate-x-1/2`;
    }
  };

  return (
    <div className="group relative" ref={cardRef}>
      <div className={`p-1.5 border rounded-md w-[72px] h-[72px] flex flex-col items-center justify-center 
                    hover:scale-105 transition-transform cursor-pointer text-center
                    ${getCategoryColor(element.category)}`}>
        <div className="text-xs text-right w-full px-0.5">{element.atomicNumber}</div>
        <div className="text-xl font-bold">{element.symbol}</div>
        <div className="text-[10px] truncate w-full text-center">{element.name}</div>
        <div className="text-[10px]">{element.atomicMass.toFixed(1)}</div>
      </div>
      
      {/* Tooltip */}
      <div className={getTooltipPositionClasses()}>
        <div className="space-y-4">
          <div className="border-b pb-2 flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">{element.name} ({element.symbol})</span>
            </div>
            <div className="text-lg font-medium text-blue-600 dark:text-blue-400">{element.chineseName}</div>
          </div>
          
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">原子序数：</span>
              <span>{element.atomicNumber}</span>
            </div>
            <div>
              <span className="font-semibold">原子质量：</span>
              <span>{element.atomicMass.toFixed(3)}</span>
            </div>
            <div>
              <span className="font-semibold">周期：</span>
              <span>{element.period}</span>
            </div>
            <div>
              <span className="font-semibold">族：</span>
              <span>{element.group}</span>
            </div>
            <div className="col-span-2">
              <span className="font-semibold">类别：</span>
              <span>{getCategoryName(element.category)}</span>
            </div>
          </div>

          {/* 物理化学性质 */}
          <div className="space-y-2">
            <h4 className="font-semibold border-b pb-1">物理化学性质</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold">电子构型：</span>
                <span>{element.electronConfiguration || '暂无数据'}</span>
              </div>
              <div>
                <span className="font-semibold">电负性：</span>
                <span>{formatValue(element.electronegativity)}</span>
              </div>
              <div>
                <span className="font-semibold">原子半径：</span>
                <span>{formatValue(element.atomicRadius, ' pm')}</span>
              </div>
              <div>
                <span className="font-semibold">第一电离能：</span>
                <span>{formatValue(element.ionizationEnergy, ' kJ/mol')}</span>
              </div>
              <div>
                <span className="font-semibold">密度：</span>
                <span>{formatValue(element.density, ' g/cm³')}</span>
              </div>
              <div>
                <span className="font-semibold">熔点：</span>
                <span>{formatValue(element.meltingPoint, ' K')}</span>
              </div>
              <div>
                <span className="font-semibold">沸点：</span>
                <span>{formatValue(element.boilingPoint, ' K')}</span>
              </div>
              {element.discoveryYear && (
                <div>
                  <span className="font-semibold">发现年份：</span>
                  <span>{element.discoveryYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tooltip arrow */}
        <div className={getTooltipArrowClasses()}></div>
      </div>
    </div>
  );
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'alkali-metal': 'bg-red-100 hover:bg-red-200',
    'alkaline-earth-metal': 'bg-orange-100 hover:bg-orange-200',
    'transition-metal': 'bg-yellow-100 hover:bg-yellow-200',
    'post-transition-metal': 'bg-green-100 hover:bg-green-200',
    'metalloid': 'bg-teal-100 hover:bg-teal-200',
    'nonmetal': 'bg-blue-100 hover:bg-blue-200',
    'halogen': 'bg-indigo-100 hover:bg-indigo-200',
    'noble-gas': 'bg-purple-100 hover:bg-purple-200',
    'lanthanide': 'bg-pink-100 hover:bg-pink-200',
    'actinide': 'bg-rose-100 hover:bg-rose-200',
  };
  
  return colors[category] || 'bg-gray-100 hover:bg-gray-200';
};

const getCategoryName = (category: string): string => {
  const names: { [key: string]: string } = {
    'alkali-metal': '碱金属',
    'alkaline-earth-metal': '碱土金属',
    'transition-metal': '过渡金属',
    'post-transition-metal': '后过渡金属',
    'metalloid': '类金属',
    'nonmetal': '非金属',
    'halogen': '卤素',
    'noble-gas': '稀有气体',
    'lanthanide': '镧系元素',
    'actinide': '锕系元素',
  };
  
  return names[category] || category;
};

export default ElementCard;
