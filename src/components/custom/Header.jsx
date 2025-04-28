import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("User data:", user);
    console.log("Profile picture URL:", user?.picture);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log("Login error:", error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: 'application/json',
      },
    }).then((resp) => {
      console.log("Google profile data:", resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    }).catch((error) => {
      console.error("Error fetching user profile: ", error);
    });
  }

  // Get user initial for fallback avatar
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className='shadow-sm flex justify-between items-center px-6'>
      <img src="/logo.svg" alt="Logo" />
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">+ Create Trip</Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>             
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    referrerPolicy="no-referrer"
                    className='h-[35px] w-[35px] rounded-full' 
                    onError={(e) => {
                      console.error("Profile image failed to load");
                      // Replace with colored circle containing user initial
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `
                        <div class="h-[35px] w-[35px] rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          ${userInitial}
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className='h-[35px] w-[35px] rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
                    {userInitial}
                  </div>
                )}
              </PopoverTrigger>
              <PopoverContent>
                <div className="py-2">
                  <div className="px-2 pb-2 mb-2 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <div 
                    className='px-2 py-1 text-red-500 hover:bg-gray-100 rounded cursor-pointer' 
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Logout
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div> : <Button onClick={() => setOpenDialog(true)}>Sign In</Button>}
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="logo" width="100px" className='items-center' />
              <h2 className='font-bold text-lg'>Sign In to check out your travel plan</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="w-full mt-6 flex gap-4 items-center">
                <FcGoogle className="h-7 w-7" />Sign in With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header