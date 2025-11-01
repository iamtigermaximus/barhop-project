// "use client";
// import { usePathname } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import {
//   Nav,
//   NavContainer,
//   Logo,
//   LogoIcon,
//   NavLinks,
//   NavLink,
//   AuthSection,
//   UserMenu,
//   UserAvatar,
//   UserDropdown,
//   UserInfo,
//   UserName,
//   UserEmail,
//   DropdownItem,
//   DropdownDivider,
//   DropdownButton,
//   SecondaryGradientButton,
//   GradientButton,
//   MobileMenuButton,
//   MobileMenu,
//   MobileNavLink,
//   MobileAuthSection,
//   MobileBottomNav,
//   MobileBottomNavItem,
//   MobileNavIcon,
//   MobileNavLabel,
// } from "./AppNavbar.styles";
// import {
//   FaHome,
//   FaUsers,
//   FaGlassMartiniAlt,
//   FaCompass,
//   FaCrown,
//   FaUser,
//   FaPlus,
//   FaBell,
//   FaComments, // ADD THIS IMPORT
// } from "react-icons/fa";
// import { useSocket } from "../../contexts/SocketContext";
// import Link from "next/link";
// import Image from "next/image";

// const AppNavbar = () => {
//   const pathname = usePathname();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const { data: session } = useSession();
//   const userMenuRef = useRef<HTMLDivElement>(null);

//   // Get notification data from socket context
//   const { unreadCount } = useSocket();

//   // Check if mobile on mount and resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Close user menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         userMenuRef.current &&
//         !userMenuRef.current.contains(event.target as Node)
//       ) {
//         setIsUserMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Route active state check
//   const isActive = (path: string) => {
//     if (path === "/app") return pathname === "/app" || pathname === "/app/";
//     if (path === "/app/vip-pass")
//       return pathname === "/app/vip-pass" || pathname === "/app/vip-pass/";
//     if (path === "/app/vip/wallet")
//       return (
//         pathname === "/app/vip/wallet" ||
//         pathname.startsWith("/app/vip-pass/vip-wallet/")
//       );
//     if (pathname === path) return true;
//     if (pathname.startsWith(path + "/")) return true;
//     return false;
//   };

//   // Desktop navigation
//   const desktopNavigation = [
//     { name: "Home", href: "/app" },
//     { name: "Social", href: "/app/social" },
//     { name: "Bars", href: "/app/bars" },
//     { name: "VIP Passes", href: "/app/vip-pass" },
//     { name: "Plan a Crawl", href: "/app/crawl-planner" },
//     ...(session ? [{ name: "My Crawls", href: "/app/my-crawls" }] : []),
//     ...(session
//       ? [{ name: "My VIP Passes", href: "/app/vip-pass/vip-wallet" }]
//       : []),
//     { name: "Discover Crawls", href: "/app/crawls-dashboard" },
//   ];

//   // Mobile bottom navigation - UPDATED WITH CHATS
//   const mobileNavigation = [
//     { name: "Home", href: "/app", icon: FaHome },
//     { name: "Social", href: "/app/social", icon: FaUsers },
//     {
//       name: "Chats",
//       href: session ? "/app/chat/my-chats" : "/app/auth/login",
//       icon: FaComments,
//     }, // ADDED CHATS
//     { name: "Create", href: "/app/crawl-planner", icon: FaPlus },
//     { name: "Discover", href: "/app/crawls-dashboard", icon: FaCompass },
//     {
//       name: "Profile",
//       href: session ? "/app/user-profile" : "/app/auth/login",
//       icon: FaUser,
//       requiresAuth: !session,
//     },
//   ];

//   const handleProfileClick = (e: React.MouseEvent) => {
//     if (!session) {
//       e.preventDefault();
//       window.location.href = "/app/auth/login";
//     }
//   };

//   const handleLogout = () => {
//     signOut({ callbackUrl: "/app" });
//     setIsUserMenuOpen(false);
//     setIsMobileMenuOpen(false);
//   };

//   const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

//   const isAuthenticated = !!session;

//   // ==================== MOBILE VIEW ====================
//   if (isMobile) {
//     return (
//       <>
//         {/* Mobile Top Navbar - Logo and Notification Bell */}
//         <Nav $isMobile={true}>
//           <NavContainer>
//             <Logo href="/app">
//               <LogoIcon>
//                 <Image
//                   src="/hoppr-neon-nobg.png"
//                   alt="Hoppr Logo"
//                   width={100}
//                   height={100}
//                   priority={true}
//                   style={{
//                     objectFit: "contain",
//                   }}
//                 />
//               </LogoIcon>
//             </Logo>

//             {/* RIGHT SIDE: Notification Bell */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//               }}
//             >
//               {/* NOTIFICATION BELL - ONLY ON MOBILE TOP NAVBAR */}
//               {isAuthenticated && (
//                 <Link
//                   href="/app/notifications"
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "#e2e8f0",
//                     cursor: "pointer",
//                     padding: "0.5rem",
//                     borderRadius: "6px",
//                     position: "relative",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     textDecoration: "none",
//                   }}
//                 >
//                   <FaBell size={20} />
//                   {unreadCount > 0 && (
//                     <span
//                       style={{
//                         position: "absolute",
//                         top: "0px",
//                         right: "0px",
//                         background: "#ec4899",
//                         color: "white",
//                         borderRadius: "50%",
//                         width: "18px",
//                         height: "18px",
//                         fontSize: "10px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontWeight: "bold",
//                         border: "2px solid rgba(15, 23, 42, 0.9)",
//                       }}
//                     >
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                 </Link>
//               )}

//               {/* For non-authenticated users on mobile, show menu button */}
//               {!isAuthenticated && (
//                 <MobileMenuButton
//                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 >
//                   ☰
//                 </MobileMenuButton>
//               )}
//             </div>
//           </NavContainer>

//           {/* Mobile dropdown for non-authenticated users */}
//           {!isAuthenticated && (
//             <MobileMenu $isOpen={isMobileMenuOpen}>
//               <MobileNavLink
//                 href="/app/auth/login"
//                 $isActive={isActive("/app/auth/login")}
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Log in
//               </MobileNavLink>
//               <MobileNavLink
//                 href="/app/auth/signup"
//                 $isActive={isActive("/app/auth/signup")}
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Sign up
//               </MobileNavLink>
//               <MobileNavLink
//                 href="/app/crawl-planner"
//                 $isActive={isActive("/app/crawl-planner")}
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Plan a Crawl
//               </MobileNavLink>
//               <MobileNavLink
//                 href="/app/crawls-dashboard"
//                 $isActive={isActive("/app/crawls-dashboard")}
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Discover Crawls
//               </MobileNavLink>
//             </MobileMenu>
//           )}
//         </Nav>

//         {/* Mobile Bottom Navigation - NOW INCLUDES CHATS */}
//         <MobileBottomNav>
//           {mobileNavigation.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <MobileBottomNavItem
//                 key={item.name}
//                 href={item.href}
//                 $isActive={isActive(item.href)}
//                 onClick={item.requiresAuth ? handleProfileClick : undefined}
//               >
//                 <MobileNavIcon>
//                   <IconComponent size={18} />
//                 </MobileNavIcon>
//                 <MobileNavLabel>
//                   {item.requiresAuth ? "Login" : item.name}
//                 </MobileNavLabel>
//               </MobileBottomNavItem>
//             );
//           })}
//         </MobileBottomNav>
//       </>
//     );
//   }

//   // ==================== DESKTOP VIEW ====================
//   return (
//     <>
//       <Nav>
//         <NavContainer>
//           <Logo href="/app">
//             <LogoIcon>
//               <Image
//                 src="/hoppr-neon-nobg.png"
//                 alt="Hoppr Logo"
//                 width={100}
//                 height={100}
//                 priority={true}
//                 style={{
//                   objectFit: "contain",
//                 }}
//               />
//             </LogoIcon>
//           </Logo>

//           <NavLinks>
//             {desktopNavigation.map((item) => (
//               <NavLink
//                 key={item.name}
//                 href={item.href}
//                 $isActive={isActive(item.href)}
//               >
//                 {item.name}
//               </NavLink>
//             ))}
//           </NavLinks>

//           <AuthSection>
//             {isAuthenticated ? (
//               <>
//                 {/* NOTIFICATION BELL FOR DESKTOP */}
//                 <Link
//                   href="/app/notifications"
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "#e2e8f0",
//                     cursor: "pointer",
//                     padding: "0.5rem",
//                     borderRadius: "6px",
//                     position: "relative",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     textDecoration: "none",
//                     marginRight: "0.5rem",
//                   }}
//                 >
//                   <FaBell size={18} />
//                   {unreadCount > 0 && (
//                     <span
//                       style={{
//                         position: "absolute",
//                         top: "2px",
//                         right: "2px",
//                         background: "#ec4899",
//                         color: "white",
//                         borderRadius: "50%",
//                         width: "16px",
//                         height: "16px",
//                         fontSize: "10px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontWeight: "bold",
//                         border: "2px solid rgba(15, 23, 42, 0.9)",
//                       }}
//                     >
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* CHATS BUTTON FOR DESKTOP */}
//                 <Link
//                   href="/app/chat/my-chats"
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "#e2e8f0",
//                     cursor: "pointer",
//                     padding: "0.5rem",
//                     borderRadius: "6px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     textDecoration: "none",
//                     marginRight: "0.5rem",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background =
//                       "rgba(139, 92, 246, 0.2)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "none";
//                   }}
//                 >
//                   <FaComments size={18} />
//                 </Link>

//                 <UserMenu ref={userMenuRef} onClick={toggleUserMenu}>
//                   <UserAvatar>
//                     {session.user?.name?.charAt(0).toUpperCase() || "U"}
//                   </UserAvatar>
//                   <UserDropdown $isOpen={isUserMenuOpen}>
//                     <UserInfo>
//                       <UserName>{session.user?.name || "User"}</UserName>
//                       <UserEmail>{session.user?.email}</UserEmail>
//                     </UserInfo>
//                     <DropdownItem
//                       href="/app/my-crawls"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       My Crawls
//                     </DropdownItem>
//                     <DropdownItem
//                       href="/app/vip-pass/vip-wallet"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       My VIP Passes
//                     </DropdownItem>
//                     <DropdownItem
//                       href="/app/user-profile"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       Profile
//                     </DropdownItem>
//                     <DropdownItem
//                       href="/app/notifications"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       Notifications
//                       {unreadCount > 0 && (
//                         <span
//                           style={{
//                             background: "#ec4899",
//                             color: "white",
//                             borderRadius: "50%",
//                             width: "18px",
//                             height: "18px",
//                             fontSize: "10px",
//                             display: "inline-flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontWeight: "bold",
//                             marginLeft: "8px",
//                           }}
//                         >
//                           {unreadCount > 9 ? "9+" : unreadCount}
//                         </span>
//                       )}
//                     </DropdownItem>
//                     <DropdownDivider />
//                     <DropdownButton onClick={handleLogout}>
//                       Log out
//                     </DropdownButton>
//                   </UserDropdown>
//                 </UserMenu>
//               </>
//             ) : (
//               <>
//                 <SecondaryGradientButton href="/app/auth/login">
//                   Log in
//                 </SecondaryGradientButton>
//                 <GradientButton href="/app/auth/signup">Sign up</GradientButton>
//               </>
//             )}
//           </AuthSection>

//           <MobileMenuButton
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             ☰
//           </MobileMenuButton>
//         </NavContainer>

//         <MobileMenu $isOpen={isMobileMenuOpen}>
//           {desktopNavigation.map((item) => (
//             <MobileNavLink
//               key={item.name}
//               href={item.href}
//               $isActive={isActive(item.href)}
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               {item.name}
//             </MobileNavLink>
//           ))}

//           <MobileAuthSection>
//             {isAuthenticated ? (
//               <>
//                 <div
//                   style={{
//                     padding: "0.5rem",
//                     color: "#e2e8f0",
//                     fontSize: "0.875rem",
//                   }}
//                 >
//                   Signed in as <strong>{session.user?.name}</strong>
//                 </div>
//                 <DropdownButton
//                   onClick={handleLogout}
//                   style={{ marginTop: "0.5rem" }}
//                 >
//                   Log out
//                 </DropdownButton>
//               </>
//             ) : (
//               <>
//                 <SecondaryGradientButton
//                   href="/app/auth/login"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Log in
//                 </SecondaryGradientButton>
//                 <GradientButton
//                   href="/app/auth/signup"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Sign up
//                 </GradientButton>
//               </>
//             )}
//           </MobileAuthSection>
//         </MobileMenu>
//       </Nav>
//     </>
//   );
// };

// export default AppNavbar;
"use client";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Nav,
  NavContainer,
  Logo,
  LogoIcon,
  NavLinks,
  NavLink,
  AuthSection,
  UserMenu,
  UserAvatar,
  UserDropdown,
  UserInfo,
  UserName,
  UserEmail,
  DropdownItem,
  DropdownDivider,
  DropdownButton,
  SecondaryGradientButton,
  GradientButton,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink,
  MobileAuthSection,
  MobileBottomNav,
  MobileBottomNavItem,
  MobileNavIcon,
  MobileNavLabel,
} from "./AppNavbar.styles";
import {
  FaHome,
  FaUsers,
  FaGlassMartiniAlt,
  FaCompass,
  FaCrown,
  FaUser,
  FaPlus,
  FaBell,
  FaComments, // Chat icon
} from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import Link from "next/link";
import Image from "next/image";

const AppNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get notification data from socket context
  const { unreadCount } = useSocket();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Route active state check
  const isActive = (path: string) => {
    if (path === "/app") return pathname === "/app" || pathname === "/app/";
    if (path === "/app/vip-pass")
      return pathname === "/app/vip-pass" || pathname === "/app/vip-pass/";
    if (path === "/app/vip/wallet")
      return (
        pathname === "/app/vip/wallet" ||
        pathname.startsWith("/app/vip-pass/vip-wallet/")
      );
    if (pathname === path) return true;
    if (pathname.startsWith(path + "/")) return true;
    return false;
  };

  // Desktop navigation
  const desktopNavigation = [
    { name: "Home", href: "/app" },
    { name: "Social", href: "/app/social" },
    { name: "Bars", href: "/app/bars" },
    { name: "VIP Passes", href: "/app/vip-pass" },
    { name: "Plan a Crawl", href: "/app/crawl-planner" },
    ...(session ? [{ name: "My Crawls", href: "/app/my-crawls" }] : []),
    ...(session
      ? [{ name: "My VIP Passes", href: "/app/vip-pass/vip-wallet" }]
      : []),
    { name: "Discover Crawls", href: "/app/crawls-dashboard" },
  ];

  // Mobile bottom navigation - WITHOUT CHATS (moved to top navbar)
  const mobileNavigation = [
    { name: "Home", href: "/app", icon: FaHome },
    { name: "Social", href: "/app/social", icon: FaUsers },
    { name: "Create", href: "/app/crawl-planner", icon: FaPlus },
    { name: "Discover", href: "/app/crawls-dashboard", icon: FaCompass },
    {
      name: "Profile",
      href: session ? "/app/user-profile" : "/app/auth/login",
      icon: FaUser,
      requiresAuth: !session,
    },
  ];

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      window.location.href = "/app/auth/login";
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/app" });
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const isAuthenticated = !!session;

  // ==================== MOBILE VIEW ====================
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Navbar - Logo, Chat Icon, and Notification Bell */}
        <Nav $isMobile={true}>
          <NavContainer>
            <Logo href="/app">
              <LogoIcon>
                <Image
                  src="/hoppr-neon-nobg.png"
                  alt="Hoppr Logo"
                  width={100}
                  height={100}
                  priority={true}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </LogoIcon>
            </Logo>

            {/* RIGHT SIDE: Chat Icon and Notification Bell */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {/* CHAT ICON - BESIDE NOTIFICATION BELL */}
              {isAuthenticated && (
                <Link
                  href="/app/chat/my-chats"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e2e8f0",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(139, 92, 246, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <FaComments size={20} />
                </Link>
              )}

              {/* NOTIFICATION BELL */}
              {isAuthenticated && (
                <Link
                  href="/app/notifications"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e2e8f0",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(139, 92, 246, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        background: "#ec4899",
                        color: "white",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        border: "2px solid rgba(15, 23, 42, 0.9)",
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* For non-authenticated users on mobile, show menu button */}
              {!isAuthenticated && (
                <MobileMenuButton
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  ☰
                </MobileMenuButton>
              )}
            </div>
          </NavContainer>

          {/* Mobile dropdown for non-authenticated users */}
          {!isAuthenticated && (
            <MobileMenu $isOpen={isMobileMenuOpen}>
              <MobileNavLink
                href="/app/auth/login"
                $isActive={isActive("/app/auth/login")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </MobileNavLink>
              <MobileNavLink
                href="/app/auth/signup"
                $isActive={isActive("/app/auth/signup")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </MobileNavLink>
              <MobileNavLink
                href="/app/crawl-planner"
                $isActive={isActive("/app/crawl-planner")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Plan a Crawl
              </MobileNavLink>
              <MobileNavLink
                href="/app/crawls-dashboard"
                $isActive={isActive("/app/crawls-dashboard")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Discover Crawls
              </MobileNavLink>
            </MobileMenu>
          )}
        </Nav>

        {/* Mobile Bottom Navigation - WITHOUT CHATS (moved to top) */}
        <MobileBottomNav>
          {mobileNavigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <MobileBottomNavItem
                key={item.name}
                href={item.href}
                $isActive={isActive(item.href)}
                onClick={item.requiresAuth ? handleProfileClick : undefined}
              >
                <MobileNavIcon>
                  <IconComponent size={18} />
                </MobileNavIcon>
                <MobileNavLabel>
                  {item.requiresAuth ? "Login" : item.name}
                </MobileNavLabel>
              </MobileBottomNavItem>
            );
          })}
        </MobileBottomNav>
      </>
    );
  }

  // ==================== DESKTOP VIEW ====================
  return (
    <>
      <Nav>
        <NavContainer>
          <Logo href="/app">
            <LogoIcon>
              <Image
                src="/hoppr-neon-nobg.png"
                alt="Hoppr Logo"
                width={100}
                height={100}
                priority={true}
                style={{
                  objectFit: "contain",
                }}
              />
            </LogoIcon>
          </Logo>

          <NavLinks>
            {desktopNavigation.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                $isActive={isActive(item.href)}
              >
                {item.name}
              </NavLink>
            ))}
          </NavLinks>

          <AuthSection>
            {isAuthenticated ? (
              <>
                {/* CHATS BUTTON FOR DESKTOP */}
                <Link
                  href="/app/chat/my-chats"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e2e8f0",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    marginRight: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(139, 92, 246, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <FaComments size={18} />
                </Link>

                {/* NOTIFICATION BELL FOR DESKTOP */}
                <Link
                  href="/app/notifications"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e2e8f0",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    marginRight: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(139, 92, 246, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <FaBell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "#ec4899",
                        color: "white",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        border: "2px solid rgba(15, 23, 42, 0.9)",
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                <UserMenu ref={userMenuRef} onClick={toggleUserMenu}>
                  <UserAvatar>
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </UserAvatar>
                  <UserDropdown $isOpen={isUserMenuOpen}>
                    <UserInfo>
                      <UserName>{session.user?.name || "User"}</UserName>
                      <UserEmail>{session.user?.email}</UserEmail>
                    </UserInfo>
                    <DropdownItem
                      href="/app/my-crawls"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Crawls
                    </DropdownItem>
                    <DropdownItem
                      href="/app/vip-pass/vip-wallet"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My VIP Passes
                    </DropdownItem>
                    <DropdownItem
                      href="/app/user-profile"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      href="/app/notifications"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span
                          style={{
                            background: "#ec4899",
                            color: "white",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            fontSize: "10px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            marginLeft: "8px",
                          }}
                        >
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownButton onClick={handleLogout}>
                      Log out
                    </DropdownButton>
                  </UserDropdown>
                </UserMenu>
              </>
            ) : (
              <>
                <SecondaryGradientButton href="/app/auth/login">
                  Log in
                </SecondaryGradientButton>
                <GradientButton href="/app/auth/signup">Sign up</GradientButton>
              </>
            )}
          </AuthSection>

          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </MobileMenuButton>
        </NavContainer>

        <MobileMenu $isOpen={isMobileMenuOpen}>
          {desktopNavigation.map((item) => (
            <MobileNavLink
              key={item.name}
              href={item.href}
              $isActive={isActive(item.href)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </MobileNavLink>
          ))}

          <MobileAuthSection>
            {isAuthenticated ? (
              <>
                <div
                  style={{
                    padding: "0.5rem",
                    color: "#e2e8f0",
                    fontSize: "0.875rem",
                  }}
                >
                  Signed in as <strong>{session.user?.name}</strong>
                </div>
                <DropdownButton
                  onClick={handleLogout}
                  style={{ marginTop: "0.5rem" }}
                >
                  Log out
                </DropdownButton>
              </>
            ) : (
              <>
                <SecondaryGradientButton
                  href="/app/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </SecondaryGradientButton>
                <GradientButton
                  href="/app/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </GradientButton>
              </>
            )}
          </MobileAuthSection>
        </MobileMenu>
      </Nav>
    </>
  );
};

export default AppNavbar;
