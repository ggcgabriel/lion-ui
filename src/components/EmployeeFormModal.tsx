import { useState, useEffect, type FormEvent } from 'react';
import { employeesApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types';

interface EmployeeFormModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeFormModal({
  employee,
  open,
  onClose,
  onSuccess,
}: EmployeeFormModalProps) {
  const isEditing = !!employee;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (open) {
      setName(employee?.name || '');
      setEmail(employee?.email || '');
      setPosition(employee?.position || '');
      setActive(employee?.active ?? true);
      setError(null);
    }
  }, [open, employee]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing && employee) {
        const data: UpdateEmployeeDto = { name, email, position, active };
        await employeesApi.update(employee.id, data);
      } else {
        const data: CreateEmployeeDto = { name, email, position, active };
        await employeesApi.create(data);
      }
      onSuccess();
    } catch (err: unknown) {
      console.error('Failed to save employee:', err);

      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
        if (axiosErr.response?.data?.message) {
          const msg = axiosErr.response.data.message;
          setError(Array.isArray(msg) ? msg.join(', ') : msg);
        } else {
          setError('Failed to save employee. Please try again.');
        }
      } else {
        setError('Failed to save employee. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Employee' : 'New Employee'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the employee information below.'
              : 'Fill in the details to create a new employee.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Employee name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@company.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Job position"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={active}
                onCheckedChange={(checked) => setActive(checked === true)}
                disabled={isSubmitting}
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
