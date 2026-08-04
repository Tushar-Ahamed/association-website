import React, { useState } from 'react';
import { CommitteeShowcase } from '../components/public/CommitteeShowcase';
import { AssignMemberModal } from '../components/committee/AssignMemberModal';

export const CommitteePage: React.FC = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen">
      <CommitteeShowcase onOpenAssignModal={() => setAssignModalOpen(true)} />
      <AssignMemberModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
      />
    </div>
  );
};
