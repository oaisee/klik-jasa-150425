import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRoleToggle } from '@/hooks/useRoleToggle';
import ProfileCompletionAlert from './ProfileCompletionAlert';
import IdVerificationAlert from './IdVerificationAlert';
import RoleIndicator from './RoleIndicator';
interface UserRoleToggleProps {
  isProvider: boolean;
  userId: string;
  onRoleChange?: (isProvider: boolean) => void;
}
const UserRoleToggle = ({
  isProvider,
  userId,
  onRoleChange
}: UserRoleToggleProps) => {
  const {
    loading,
    isProviderState,
    showProfileAlert,
    showIdVerificationAlert,
    handleToggleChange,
    handleCompleteProfile,
    handleCancelProviderMode,
    handleVerifyId
  } = useRoleToggle({
    isProvider,
    userId,
    onRoleChange
  });
  return <div className="flex flex-col space-y-4">
      {showProfileAlert && <ProfileCompletionAlert onCompleteProfile={handleCompleteProfile} onCancel={handleCancelProviderMode} />}
      
      {showIdVerificationAlert && <IdVerificationAlert onVerify={handleVerifyId} onCancel={handleCancelProviderMode} userId={userId} />}
      
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <RoleIndicator isProvider={isProviderState} />

        <div className="flex items-center space-x-2">
          <Label htmlFor="user-role-toggle" className="sr-only">
            Toggle user role
          </Label>
          <Switch id="user-role-toggle" checked={isProviderState} onCheckedChange={handleToggleChange} disabled={loading} aria-label="Toggle user role" className="text-base bg-red-950 hover:bg-red-800 text-gray-200" />
        </div>
      </div>
      
      {loading && <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
        </div>}
    </div>;
};
export default UserRoleToggle;