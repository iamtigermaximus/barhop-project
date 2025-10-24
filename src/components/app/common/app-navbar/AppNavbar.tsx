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
} from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import NotificationsPanel from "../../notifications/notification-panel/NotificationPanel";
// ADD THIS IMPORT

const AppNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get notification data from socket context
  const [showNotifications, setShowNotifications] = useState(false);
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
    if (path === "/app/vip")
      return pathname === "/app/vip" || pathname === "/app/vip/";
    if (path === "/app/vip/wallet")
      return (
        pathname === "/app/vip/wallet" ||
        pathname.startsWith("/app/vip/wallet/")
      );
    if (pathname === path) return true;
    if (pathname.startsWith(path + "/")) return true;
    return false;
  };

  // Desktop navigation
  const desktopNavigation = [
    { name: "Home", href: "/app" },
    { name: "Social Map", href: "/app/social" },
    { name: "Bars", href: "/app/bars" },
    { name: "VIP Passes", href: "/app/vip" },
    { name: "Plan a Crawl", href: "/app/crawl-planner" },
    ...(session ? [{ name: "My Crawls", href: "/app/my-crawls" }] : []),
    ...(session ? [{ name: "My VIP Passes", href: "/app/vip/wallet" }] : []),
    { name: "Discover Crawls", href: "/app/crawls-dashboard" },
  ];

  // Mobile bottom navigation
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
        {/* Mobile Top Navbar - ONLY has Logo and Notification Bell */}
        <Nav $isMobile={true}>
          <NavContainer>
            <Logo href="/app">
              <LogoIcon>🍻</LogoIcon>
              Hoppr
            </Logo>

            {/* RIGHT SIDE: Use inline styles to avoid the hidden AuthSection */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {/* NOTIFICATION BELL - ONLY ON MOBILE TOP NAVBAR */}
              {isAuthenticated && (
                <button
                  onClick={() => setShowNotifications(true)}
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
                </button>
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

        {/* Mobile Bottom Navigation - This has the user menu items */}
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

        {/* ADD NOTIFICATIONS PANEL HERE - Outside the main nav structure */}
        <NotificationsPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </>
    );
  }

  // ==================== DESKTOP VIEW ====================
  return (
    <>
      <Nav>
        <NavContainer>
          <Logo href="/app">
            <LogoIcon>🍻</LogoIcon>
            Hoppr
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
                    href="/app/vip/wallet"
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
                  <DropdownDivider />
                  <DropdownButton onClick={handleLogout}>
                    Log out
                  </DropdownButton>
                </UserDropdown>
              </UserMenu>
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

      {/* ADD NOTIFICATIONS PANEL FOR DESKTOP TOO */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default AppNavbar;
