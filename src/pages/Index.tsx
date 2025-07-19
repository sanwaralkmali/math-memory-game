import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Calculator, Zap, Play, Trophy, Users } from 'lucide-react';

const Index = () => {
  const skills = [
    {
      id: 'convert-rational',
      title: 'Convert Decimals to Fractions',
      description: 'Practice converting between decimals and fractions by matching equivalent values.',
      difficulty: 'Intermediate',
      pairs: 12,
      icon: Calculator,
      color: 'bg-primary text-primary-foreground',
      hasDashboard: true,
    },
    {
      id: 'basic-addition',
      title: 'Basic Addition',
      description: 'Match addition problems with their correct answers.',
      difficulty: 'Beginner',
      pairs: 8,
      icon: Brain,
      color: 'bg-success text-success-foreground',
      hasDashboard: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-game-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Memory Game Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Learn Math with
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Memory Games</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Enhance your math skills through interactive memory matching games. 
            Choose from various topics and difficulty levels to challenge yourself.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span>Memory Training</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              <span>Score Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span>Progressive Difficulty</span>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Available Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <Card key={skill.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Badge variant="outline">{skill.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {skill.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{skill.pairs} pairs</span>
                        {skill.hasDashboard && (
                          <Badge variant="secondary" className="text-xs">
                            Multiple modes
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link to={`/game?skill=${skill.id}`}>
                      <Button 
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        <Play className="w-4 h-4" />
                        {skill.hasDashboard ? 'Choose Mode' : 'Start Game'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold mb-2">Choose a Skill</h4>
              <p className="text-sm text-muted-foreground">
                Select from various math topics and difficulty levels
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold mb-2">Match the Pairs</h4>
              <p className="text-sm text-muted-foreground">
                Flip cards to find matching mathematical expressions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold mb-2">Track Progress</h4>
              <p className="text-sm text-muted-foreground">
                Monitor your score, time, and improvement over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
