"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Settings, Star, Users } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { timeAgo } from "@/utils/timeAgo";
import SelectLanguage from "@/components/popups/SelectLanguage";
import { useEffect, useState } from "react";

export default function Profile() {
    
    const { user } = useAuth();
    const dbUser = user?.dbUser;
    const role = dbUser?.role;
    const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : ''; 

    const [showLanguagePopup, setShowLanguagePopup] = useState(false);

    useEffect(() => {
      if (dbUser && !dbUser.language) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowLanguagePopup(true);
      }
    }, [dbUser]);

    const handleLanguageSelect = async (language) => {
      try {
        console.log("Selected language:", language);
        setShowLanguagePopup(false);
      } catch (error) {
        console.error("Failed to select language:", error);
      }
    };

    return (
        <>
    {showLanguagePopup && (
      <SelectLanguage
        open={showLanguagePopup}
        onOpenChange={setShowLanguagePopup}
        currentLanguage={dbUser?.language}
        onLanguageSelect={handleLanguageSelect}
      />
    )}
      <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 size-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 size-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-0">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="size-18">
                    <AvatarImage
                      src={dbUser.photoURL || "https://github.com/shadcn.png"}
                      alt={dbUser.displayname || "User"}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-lg font-semibold">{dbUser?.displayName || "User"}</h2>
                  <p className="text-black text-sm">
                    <span className="font-bold">Language</span>: {dbUser?.language || "Non"} 
                  </p>
                  <Badge className={`text-white font-bold ${dbUser?.status == 'active' ? "bg-green-500" : "bg-red-500"} mt-2`} variant="secondary">
                    {dbUser?.status}
                  </Badge>
                  <Button className="mt-4 w-full" size="sm">
                    <Mail className="mr-2 size-4" />
                    Message
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span>{dbUser?.createdAt
                        ? new Date(dbUser.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })
                        : 'Not available'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last active</span>
                    <span>{timeAgo(dbUser?.lastLoginAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span>{formattedRole}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 md:col-span-3 bg-white flex justify-center items-center rounded-2xl border border-gray-300">
            <p>Under Construction</p>
            {/* Stats */}
            {/* <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Star className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">0</p>
                      <p className="text-muted-foreground text-sm">
                        Published Works
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Users className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">8.5k</p>
                      <p className="text-muted-foreground text-sm">
                        Followers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Star className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">99%</p>
                      <p className="text-muted-foreground text-sm">
                        Satisfaction Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div> */}

            {/* Recent Activity */}
            {/* <Card className="p-0">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 border-b pb-4 last:border-0"
                    >
                      <div className="bg-muted rounded-full p-2">
                        <Star className="text-muted-foreground size-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          Completed project &quot;Dashboard UI&quot;
                        </p>
                        <p className="text-muted-foreground text-xs">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
      </>
    );
}   
