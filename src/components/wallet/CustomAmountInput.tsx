
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomAmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomAmountInput = ({ value, onChange }: CustomAmountInputProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onChange(value);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="amount">Jumlah Kustom</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
        <Input
          id="amount"
          value={value}
          onChange={handleAmountChange}
          className="pl-10"
          placeholder="Minimal Rp 10.000"
        />
      </div>
    </div>
  );
};

export default CustomAmountInput;
