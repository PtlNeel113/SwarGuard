/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Page Not Found · SwarGuard';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 select-none">
      <div className="w-16 h-16 rounded-2xl bg-[#171F3A] border border-[#263359] flex items-center justify-center text-[#F2A65A] mb-5 shadow-lg">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="text-xs uppercase font-extrabold tracking-wider text-[#FF5B64] mb-2 font-mono">
        HTTP 404 · Unrecognized Route
      </div>

      <h1 className="text-3xl font-extrabold text-[#F6F3EC] mb-3">
        Route Not Found in Security Map
      </h1>

      <p className="text-sm text-[#9AA6BC] max-w-md mb-8 leading-relaxed">
        The requested URL is not part of SwarGuard’s verified navigation paths. Return to
        the main security dashboard or open the command palette.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
        >
          Return to Overview
        </Button>
      </div>
    </div>
  );
};
