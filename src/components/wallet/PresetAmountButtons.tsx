
import { Button } from "@/components/ui/button";

interface PresetAmountButtonsProps {
  selectedAmount: number | '';
  onAmountSelect: (amount: number) => void;
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];

const PresetAmountButtons = ({ selectedAmount, onAmountSelect }: PresetAmountButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PRESET_AMOUNTS.map((presetAmount) => (
        <Button
          key={presetAmount}
          variant={selectedAmount === presetAmount ? "default" : "outline"}
          onClick={() => onAmountSelect(presetAmount)}
          className="w-full"
        >
          Rp {presetAmount.toLocaleString()}
        </Button>
      ))}
    </div>
  );
};

export default PresetAmountButtons;
