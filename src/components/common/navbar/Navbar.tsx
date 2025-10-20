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
} from "./Navbar.styles";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    // For "/vip" only highlight when exactly on "/vip"
    if (path === "/vip") {
      return pathname === "/vip";
    }

    // For other paths, use startsWith
    return pathname.startsWith(path);
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Social Map", href: "/social" },
    { name: "Bars", href: "/bars" },
    { name: "VIP Passes", href: "/vip" },

    { name: "Plan a Crawl", href: "/crawl-planner" },
    // Only show "My Crawls" when user is authenticated
    ...(session ? [{ name: "My Crawls", href: "/my-crawls" }] : []),
    ...(session ? [{ name: "My VIP Passes", href: "/vip/wallet" }] : []),

    { name: "Discover Crawls", href: "/crawls-dashboard" },
  ];

  // const isActive = (path: string) => {
  //   if (path === "/") {
  //     return pathname === "/";
  //   }
  //   return pathname.startsWith(path);
  // };

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isAuthenticated = !!session;

  return (
    <Nav>
      <NavContainer>
        {/* Logo */}
        <Logo href="/">
          <LogoIcon>🍻</LogoIcon>
          Hoppr
        </Logo>

        {/* Desktop Navigation */}
        <NavLinks>
          {navigation.map((item) => (
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
                  href="/my-crawls"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  My Crawls
                </DropdownItem>
                <DropdownItem
                  href="/vip/wallet"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  My VIP Passes
                </DropdownItem>
                <DropdownItem
                  href="/user-profile"
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
              <SecondaryGradientButton href="/auth/login">
                Log in
              </SecondaryGradientButton>
              <GradientButton href="/auth/signup">Sign up</GradientButton>
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
        {navigation.map((item) => (
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
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </SecondaryGradientButton>
              <GradientButton
                href="/auth/signup"
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
export default Navbar;
