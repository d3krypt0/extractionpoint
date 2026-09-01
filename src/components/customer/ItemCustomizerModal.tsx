import React, { useState } from 'react';
import { MenuItem, CustomizationOption, MilkOption, SweetnessLevel, Temperature } from '../../types';
import { formatPhp } from '../../utils/phCurrency';
import { X, Plus, Minus, Check, Flame, Coffee } from 'lucide-react';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customization: CustomizationOption, quantity: number) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [temperature, setTemperature] = useState<Temperature>('iced');
  const [sweetness, setSweetness] = useState<SweetnessLevel>(50);
  const [milk, setMilk] = useState<MilkOption>('regular');
  const [extraShots, setExtraShots] = useState<number>(0);
  const [addHorchataShot, setAddHorchataShot] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !item) return null;

  const isBeverage = item.group === 'coffee' || item.group === 'matcha' || item.group === 'non_coffee';
  const allowsMilk = item.customizable?.allowMilk ?? (isBeverage && item.category !== 'infusions' && item.category !== 'elixirs' && !item.name.toLowerCase().includes('americano'));
  const allowsSweetness = item.customizable?.allowSweetness ?? isBeverage;
  const allowsExtraShot = item.customizable?.allowExtraShot ?? (item.group === 'coffee');
  const allowsTemp = item.customizable?.allowTemp ?? (item.group === 'matcha' || item.name.toLowerCase().includes('choco'));

  // Calculate Unit Price
  let unitPrice = item.price;
  if (milk !== 'regular') unitPrice += 50;
  if (extraShots > 0) unitPrice += extraShots * 80;
  if (addHorchataShot) unitPrice += 80;

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customization: CustomizationOption = {
      temperature: allowsTemp ? temperature : undefined,
      sweetness: allowsSweetness ? sweetness : undefined,
      milk: allowsMilk ? milk : undefined,
      extraEspressoShots: extraShots > 0 ? extraShots : undefined,
      addEspressoShot: addHorchataShot ? true : undefined,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
    };

    onAddToCart(item, customization, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#faf8f5] dark:bg-[#121215] rounded-2xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#e8e2d8] dark:border-[#222226]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#c5a880] dark:text-[#dfcca9]">
                {item.category.replace('_', ' ')}
              </span>
              {item.isSignature && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9]">
                  Signature
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#f8f7f4] mt-1">
              {item.name}
            </h3>
            {item.subtitle && (
              <p className="text-xs text-[#888888] dark:text-[#99999f]">{item.subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#777777] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Description */}
          <p className="text-xs text-[#555555] dark:text-[#a0a0a5] leading-relaxed italic">
            "{item.description}"
          </p>

          {/* Temperature Option */}
          {allowsTemp && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#333333] dark:text-[#dedede] mb-2.5">
                Temperature Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTemperature('iced')}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-medium transition-all ${
                    temperature === 'iced'
                      ? 'border-[#111111] dark:border-[#f8f7f4] bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm font-semibold'
                      : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#aaaaaf] hover:bg-[#eae4db]/50 dark:hover:bg-[#222226]'
                  }`}
                >
                  <Coffee className="w-4 h-4 text-blue-400" />
                  <span>Iced (Chilled)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('hot')}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-medium transition-all ${
                    temperature === 'hot'
                      ? 'border-[#111111] dark:border-[#f8f7f4] bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm font-semibold'
                      : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#aaaaaf] hover:bg-[#eae4db]/50 dark:hover:bg-[#222226]'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Hot (Steamed)</span>
                </button>
              </div>
            </div>
          )}

          {/* Sweetness Level */}
          {allowsSweetness && (
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#333333] dark:text-[#dedede]">
                  Sweetness Level
                </label>
                <span className="text-xs font-bold text-[#c5a880]">{sweetness}% Sugar</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {([0, 25, 50, 75, 100] as SweetnessLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSweetness(level)}
                    className={`py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      sweetness === level
                        ? 'border-[#c5a880] bg-[#c5a880] text-black font-bold shadow-sm'
                        : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#9999a0] hover:border-[#c5a880]/50'
                    }`}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Substitute */}
          {allowsMilk && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#333333] dark:text-[#dedede] mb-2.5">
                Milk Selection
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'regular', name: 'Fresh Dairy Barista Milk', cost: 0 },
                  { id: 'oat', name: 'Barista Oat Milk', cost: 50 },
                  { id: 'coconut', name: 'Crafted Coconut Milk', cost: 50 },
                  { id: 'almond', name: 'Almond Milk', cost: 50 },
                  { id: 'soy', name: 'Soy Milk', cost: 50 },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMilk(opt.id as MilkOption)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      milk === opt.id
                        ? 'border-[#111111] dark:border-[#dfcca9] bg-[#ece6dc] dark:bg-[#1e1e23] font-medium'
                        : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#9999a0] hover:bg-[#eae4db]/40 dark:hover:bg-[#1c1c20]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        milk === opt.id ? 'border-[#c5a880] bg-[#c5a880]' : 'border-gray-400'
                      }`}>
                        {milk === opt.id && <Check className="w-2.5 h-2.5 text-black" />}
                      </div>
                      <span className="text-xs text-[#111111] dark:text-[#f0f0f4]">{opt.name}</span>
                    </div>
                    {opt.cost > 0 && (
                      <span className="text-xs font-bold text-[#c5a880]">+{formatPhp(opt.cost)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Espresso Shot Add-on */}
          {allowsExtraShot && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ede8e0] dark:bg-[#19191d] border border-[#ded8cf] dark:border-[#28282e]">
              <div>
                <div className="flex items-center space-x-1.5">
                  <Coffee className="w-4 h-4 text-[#c5a880]" />
                  <span className="text-xs font-bold text-[#111111] dark:text-[#f8f7f4]">
                    Extra Espresso Shot
                  </span>
                </div>
                <p className="text-[11px] text-[#666666] dark:text-[#999999] mt-0.5">
                  Single shot Vietnam Arabica (+₱80 / shot)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setExtraShots((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-full bg-[#ded8cf] dark:bg-[#2b2b30] flex items-center justify-center text-xs hover:bg-[#c5a880] hover:text-black transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm w-5 text-center text-[#111111] dark:text-white">
                  {extraShots}
                </span>
                <button
                  type="button"
                  onClick={() => setExtraShots((prev) => Math.min(3, prev + 1))}
                  className="w-7 h-7 rounded-full bg-[#ded8cf] dark:bg-[#2b2b30] flex items-center justify-center text-xs hover:bg-[#c5a880] hover:text-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Horchata Dirty Shot Option */}
          {item.id === 'potion-horchata' && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ede8e0] dark:bg-[#19191d] border border-[#ded8cf] dark:border-[#28282e]">
              <div>
                <span className="text-xs font-bold text-[#111111] dark:text-[#f8f7f4]">
                  Make it Dirty (+ Espresso Shot)
                </span>
                <p className="text-[11px] text-[#666666] dark:text-[#999999]">
                  Adds a rich shot of espresso to your Horchata (+₱80)
                </p>
              </div>
              <input
                type="checkbox"
                checked={addHorchataShot}
                onChange={(e) => setAddHorchataShot(e.target.checked)}
                className="w-5 h-5 accent-[#c5a880] rounded cursor-pointer"
              />
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333] dark:text-[#dedede] mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Less ice, extra hot, dressing on side..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18181b] border border-[#ded8ce] dark:border-[#2a2a30] text-xs text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:border-[#c5a880]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 sm:p-5 border-t border-[#e8e2d8] dark:border-[#222226] bg-[#f5f1ea] dark:bg-[#16161a] flex items-center justify-between">
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-white dark:bg-[#1f1f24] p-1 rounded-xl border border-[#ded8ce] dark:border-[#2e2e34]">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm text-[#111111] dark:text-white w-7 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 ml-4 py-3 px-5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs sm:text-sm flex items-center justify-between hover:opacity-95 active:scale-[0.98] transition-all shadow-md"
          >
            <span>Add to Order</span>
            <span className="font-mono">{formatPhp(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
