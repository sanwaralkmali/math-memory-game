import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { loadSkillData } from '@/utils/skillLoader';

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillId = searchParams.get('skill');

  useEffect(() => {
    // If no skill is provided, redirect to 404
    if (!skillId) {
      navigate('/404', { replace: true });
      return;
    }

    // Check if the skill exists
    const checkSkill = async () => {
      try {
        const skillData = await loadSkillData(skillId);
        if (!skillData) {
          // Skill not found, redirect to 404
          navigate('/404', { replace: true });
          return;
        }
        
        // Skill exists, redirect to game page
        navigate(`/game?skill=${skillId}`, { replace: true });
      } catch (error) {
        // Error loading skill, redirect to 404
        navigate('/404', { replace: true });
      }
    };

    checkSkill();
  }, [skillId, navigate]);

  // Show loading while checking skill and redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm max-w-md mx-4">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4" />
            Loading Game
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            Math Memory Games
          </CardTitle>
          <p className="text-gray-600">
            Checking skill availability...
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500">Please wait...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
