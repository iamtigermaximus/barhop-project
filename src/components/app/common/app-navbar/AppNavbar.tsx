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
} from "react-icons/fa";

const AppNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Improved isActive function with exact matching for specific routes
  const isActive = (path: string) => {
    // For home page, check exact match
    if (path === "/app") {
      return pathname === "/app" || pathname === "/app/";
    }

    // For VIP routes, we need exact matching to avoid conflicts
    if (path === "/app/vip") {
      // Only active for exact VIP marketplace, not wallet
      return pathname === "/app/vip" || pathname === "/app/vip/";
    }

    if (path === "/app/vip/wallet") {
      // Only active for exact wallet route
      return (
        pathname === "/app/vip/wallet" ||
        pathname.startsWith("/app/vip/wallet/")
      );
    }

    // For other pages, check if the pathname starts with the path + "/"
    // to avoid partial matches
    if (pathname === path) {
      return true;
    }

    if (pathname.startsWith(path + "/")) {
      return true;
    }

    return false;
  };

  // Desktop navigation (full list)
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

  // Handle profile click for unauthenticated users
  const handleProfileClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      window.location.href = "/app/auth/login";
    }
  };

  // Mobile bottom navigation with React Icons
  const mobileNavigation = [
    { name: "Home", href: "/app", icon: FaHome },
    { name: "Social", href: "/app/social", icon: FaUsers },
    // { name: "Bars", href: "/app/bars", icon: FaGlassMartiniAlt },
    { name: "Create", href: "/app/crawl-planner", icon: FaPlus },
    // { name: "VIP", href: "/app/vip", icon: FaCrown },
    { name: "Discover", href: "/app/crawls-dashboard", icon: FaCompass },
    {
      name: "Profile",
      href: session ? "/app/user-profile" : "/app/auth/login",
      icon: FaUser,
      requiresAuth: !session,
    },
  ];

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isAuthenticated = !!session;

  // Don't render nav on mobile - we'll use bottom nav instead
  if (isMobile) {
    return (
      <>
        {/* Simplified Top Bar for Mobile */}
        <Nav $isMobile={true}>
          <NavContainer>
            <Logo href="/app">
              <LogoIcon>🍻</LogoIcon>
              Hoppr
            </Logo>

            {/* Mobile user menu or auth buttons */}
            <AuthSection>
              {isAuthenticated ? (
                <UserMenu ref={userMenuRef} onClick={toggleUserMenu}>
                  <UserAvatar $isMobile={true}>
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </UserAvatar>
                  <UserDropdown $isOpen={isUserMenuOpen} $isMobile={true}>
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
                <MobileMenuButton
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  ☰
                </MobileMenuButton>
              )}
            </AuthSection>
          </NavContainer>

          {/* Mobile dropdown menu for non-authenticated users */}
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

        {/* Mobile Bottom Navigation with React Icons */}
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

  // Original Desktop Navigation
  return (
    <Nav>
      <NavContainer>
        {/* Logo */}
        <Logo href="/app">
          <LogoIcon>🍻</LogoIcon>
          Hoppr
        </Logo>

        {/* Desktop Navigation */}
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

        {/* Desktop Auth Section */}
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
                <DropdownButton onClick={handleLogout}>Log out</DropdownButton>
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

        {/* Mobile Menu Button */}
        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </MobileMenuButton>
      </NavContainer>

      {/* Mobile Menu */}
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
  );
};

export default AppNavbar;
