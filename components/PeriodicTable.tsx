import { Element } from '../types/element';
import ElementCard from './ElementCard';

interface PeriodicTableProps {
  elements: Element[];
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements }) => {
  const getElementByPosition = (group: number, period: number) => {
    return elements.find(element => element.group === group && element.period === period);
  };

  const renderPeriod = (period: number) => {
    const groups = Array.from({ length: 18 }, (_, i) => i + 1);

    return (
      // 移除 getOffset() 应用
      <div key={period} className={`flex gap-0.5`}>
        {/* 第6和第7周期的特殊标记 */}
        {(period === 6 || period === 7) && (
          <div className="absolute -ml-[54px] flex items-center justify-center w-[18px] h-[72px] text-xs">
            {period === 6 ? '*' : '**'}
          </div>
        )}
        
        {groups.map(group => {
          const element = getElementByPosition(group, period);
          
          // 特殊处理第一周期的空格
          if (period === 1 && group > 1 && group < 18) {
            return <div key={`${period}-${group}`} className="w-[72px] h-[72px]" />;
          }
          // 特殊处理第二、三周期的空格
          if ((period === 2 || period === 3) && group > 2 && group < 13) {
            return <div key={`${period}-${group}`} className="w-[72px] h-[72px]" />;
          }

          // 添加镧系和锕系占位符
          if (period === 6 && group === 3) {
            return (
              <div key={`${period}-${group}`} className="w-[72px] h-[72px] border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                57-71<br/>*
              </div>
            );
          }
          if (period === 7 && group === 3) {
             return (
              <div key={`${period}-${group}`} className="w-[72px] h-[72px] border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                89-103<br/>**
              </div>
            );
          }

          // 简化逻辑：如果找不到元素（包括第6/7周期的f区空位），则渲染空div
          if (!element) {
            // Don't render empty divs for groups 4-17 in period 6/7 main table, as these are covered by the Ln/Ac rows below
            if (!((period === 6 || period === 7) && group >= 4 && group <= 17)) {
               return <div key={`${period}-${group}`} className="w-[72px] h-[72px]" />;
            }
          } else {
             // 如果找到元素，则渲染ElementCard
             return <ElementCard key={element.atomicNumber} element={element} />;
          }
          // Return null or an empty fragment for the skipped cells in period 6/7 main table
          return null; 
        })}
      </div>
    );
  };

  return (
    <div className="p-4 select-none">
      <div className="flex flex-col gap-0.5">
        {/* 主周期表 */}
        {Array.from({ length: 7 }, (_, i) => i + 1).map(period => (
          <div key={period} className="relative">
            {renderPeriod(period)}
          </div>
        ))}

        {/* 镧系和锕系元素 */}
        <div className="mt-8 flex flex-col gap-0.5">
          {/* 镧系元素 */}
          <div className="flex gap-0.5 ml-[144px]">
            {elements
              .filter(element => element.period === 8)
              .sort((a, b) => a.atomicNumber - b.atomicNumber)
              .map(element => (
                <ElementCard key={element.atomicNumber} element={element} />
              ))}
          </div>
          {/* 锕系元素 */}
          <div className="flex gap-0.5 ml-[144px]">
            {elements
              .filter(element => element.period === 9)
              .sort((a, b) => a.atomicNumber - b.atomicNumber)
              .map(element => (
                <ElementCard key={element.atomicNumber} element={element} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
