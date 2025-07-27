import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, Calculator, Brain } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const availableSkills = [
    {
      id: "convert-rational",
      title: "Decimals & Fractions",
      description: "Match decimals with their fraction equivalents",
      icon: Calculator,
      color: "bg-gradient-to-br from-blue-500 to-purple-600 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              Game Not Found
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              404 - Game Not Found
            </CardTitle>
            <p className="text-gray-600">
              The requested skill or game could not be found. Please check the
              URL or choose from available games below.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-4">Available games:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableSkills.map((skill) => {
                  const IconComponent = skill.icon;
                  return (
                    <Card
                      key={skill.id}
                      className="border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${skill.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-800">
                              {skill.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                          onClick={() =>
                            (window.location.href = `/?skill=${skill.id}`)
                          }
                        >
                          Play Game
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                To play a game, use the URL format:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  /?skill=skill-name
                </code>
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  (window.location.href = "/?skill=convert-rational")
                }
              >
                <Home className="w-4 h-4" />
                Try Default Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
