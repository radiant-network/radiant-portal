import { useState } from 'react';
import { Button } from '@/components/base/ui/button';
import { Input } from '@/components/base/ui/input';
import { Checkbox } from '@/components/base/ui/checkbox';
import { useI18n } from '@/components/hooks/i18n';

interface User {
  reference: string;
}

interface CaseAssignationProps {
  initialAssignations?: User[];
  onAssignationsChange?: (users: User[]) => void;
}

const CaseAssignation = ({ initialAssignations = [], onAssignationsChange }: CaseAssignationProps) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>(initialAssignations);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock users for demonstration - replace with actual API call
  const mockUsers = [
    { reference: 'Practitioner/34949' },
    { reference: 'Practitioner/88777' },
    { reference: 'Organization/LDM-CHUSJ' },
  ];

  const handleUserSelect = (user: User) => {
    const newUsers = [...selectedUsers, user];
    setSelectedUsers(newUsers);
    setSearchTerm('');
    setShowDropdown(false);
    onAssignationsChange?.(newUsers);
  };

  const handleUserRemove = (userToRemove: User) => {
    const newUsers = selectedUsers.filter(user => user.reference !== userToRemove.reference);
    setSelectedUsers(newUsers);
    onAssignationsChange?.(newUsers);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleReset = () => {
    setSelectedUsers([]);
    onAssignationsChange?.([]);
  };

  const getInitials = (reference: string) => {
    const name = reference.split('/')[1];
    return name.substring(0, 2).toUpperCase();
  };

  const getRandomColor = (reference: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const index = reference.charCodeAt(reference.length - 1) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder={t('case.assignation.searchPlaceholder') || 'Search users...'}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
        {searchTerm && showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {!selectedUsers.length && (
              <div className="p-2 text-gray-500 border-b">
                <Button variant="ghost" className="w-full justify-start text-gray-500" disabled>
                  {t('case.assignation.removeAssignations') || 'Remove assignations'}
                </Button>
              </div>
            )}
            {mockUsers
              .filter(
                user =>
                  user.reference.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  !selectedUsers.some(selected => selected.reference === user.reference)
              )
              .map(user => (
                <div
                  key={user.reference}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className={`w-8 h-8 rounded-full ${getRandomColor(user.reference)} flex items-center justify-center text-white font-semibold`}>
                    {getInitials(user.reference)}
                  </div>
                  <span className="font-semibold">{user.reference}</span>
                  <span className="text-gray-500">LDM-CHUSJ</span>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {selectedUsers.map(user => (
          <div key={user.reference} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Checkbox />
            <div className={`w-8 h-8 rounded-full ${getRandomColor(user.reference)} flex items-center justify-center text-white font-semibold`}>
              {getInitials(user.reference)}
            </div>
            <span className="font-semibold">{user.reference}</span>
            <span className="text-gray-500">LDM-CHUSJ</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          {t('case.assignation.reset') || 'Reset'}
        </Button>
        <Button variant="default">
          {t('case.assignation.filter') || 'Filter'}
        </Button>
      </div>
    </div>
  );
};

export default CaseAssignation;
