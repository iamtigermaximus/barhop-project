// "use client";
// import styled from "styled-components";
// import Link from "next/link";

// export const Nav = styled.nav`
//   background: rgba(15, 23, 42, 0.95);
//   backdrop-filter: blur(10px);
//   border-bottom: 1px solid #334155;
//   position: sticky;
//   top: 0;
//   z-index: 1000;
//   padding: 0 1rem;
// `;

// export const NavContainer = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   height: 70px;
// `;

// export const Logo = styled(Link)`
//   font-size: 1.5rem;
//   font-weight: 700;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
//   background-size: 400% 400%;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
//   text-decoration: none;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   animation: gradientShift 8s ease infinite;

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// export const LogoIcon = styled.span`
//   font-size: 1.75rem;
// `;

// export const NavLinks = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 2rem;

//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// export const NavLink = styled(Link)<{ $isActive?: boolean }>`
//   color: ${(props) => (props.$isActive ? "#0ea5e9" : "#cbd5e1")};
//   text-decoration: none;
//   font-weight: 500;
//   transition: all 0.3s ease;
//   position: relative;
//   padding: 0.5rem 0;

//   &:hover {
//     color: #0ea5e9;
//   }

//   ${(props) =>
//     props.$isActive &&
//     `
//     &::after {
//       content: '';
//       position: absolute;
//       bottom: -8px;
//       left: 0;
//       width: 100%;
//       height: 2px;
//       background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
//       border-radius: 2px;
//     }
//   `}
// `;

// export const GradientButton = styled(Link)`
//   background: #a84eff;
//   background-size: 400% 400%;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 8px;
//   text-decoration: none;
//   font-weight: 600;
//   transition: all 0.3s ease;
//   animation: gradientShift 8s ease infinite;
//   position: relative;
//   overflow: hidden;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
//     border-color: rgba(139, 92, 246, 0.6);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -100%;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       90deg,
//       transparent,
//       rgba(255, 255, 255, 0.1),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover::before {
//     left: 100%;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// export const SecondaryGradientButton = styled(Link)`
//   background: transparent;
//   border: 1px solid;
//   border-image: linear-gradient(45deg, #0ea5e9, #8b5cf6) 1;
//   color: #cbd5e1;
//   padding: 0.75rem 1.5rem;
//   border-radius: 8px;
//   text-decoration: none;
//   font-weight: 500;
//   transition: all 0.3s ease;
//   position: relative;

//   &:hover {
//     background: linear-gradient(
//       45deg,
//       rgba(14, 165, 233, 0.1),
//       rgba(139, 92, 246, 0.1)
//     );
//     color: white;
//     transform: translateY(-1px);
//   }
// `;

// export const UserMenu = styled.div`
//   position: relative;
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   cursor: pointer;
// `;

// export const UserAvatar = styled.div`
//   width: 2.5rem;
//   height: 2.5rem;
//   border-radius: 50%;
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   font-weight: 600;
//   font-size: 0.875rem;
//   transition: transform 0.2s ease;

//   ${UserMenu}:hover & {
//     transform: scale(1.05);
//   }
// `;

// export const UserDropdown = styled.div<{ $isOpen: boolean }>`
//   position: absolute;
//   top: 100%;
//   right: 0;
//   margin-top: 0.5rem;
//   background: rgba(30, 41, 59, 0.95);
//   backdrop-filter: blur(20px);
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   border-radius: 12px;
//   padding: 0.75rem;
//   min-width: 200px;
//   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
//   display: ${(props) => (props.$isOpen ? "block" : "none")};
//   z-index: 1001;

//   /* Create invisible gap to prevent hover interruption */
//   &::before {
//     content: "";
//     position: absolute;
//     top: -0.5rem;
//     left: 0;
//     right: 0;
//     height: 0.5rem;
//     background: transparent;
//   }
// `;

// export const UserInfo = styled.div`
//   padding: 0.5rem;
//   border-bottom: 1px solid rgba(139, 92, 246, 0.2);
//   margin-bottom: 0.5rem;
// `;

// export const UserName = styled.div`
//   color: #f8fafc;
//   font-weight: 600;
//   font-size: 0.875rem;
// `;

// export const UserEmail = styled.div`
//   color: #94a3b8;
//   font-size: 0.75rem;
//   margin-top: 0.25rem;
// `;

// export const DropdownItem = styled(Link)`
//   display: block;
//   padding: 0.75rem;
//   color: #e2e8f0;
//   text-decoration: none;
//   border-radius: 6px;
//   font-size: 0.875rem;
//   transition: all 0.2s ease;

//   &:hover {
//     background: rgba(139, 92, 246, 0.1);
//     color: #f8fafc;
//   }
// `;

// export const DropdownButton = styled.button`
//   display: block;
//   width: 100%;
//   padding: 0.75rem;
//   background: transparent;
//   border: none;
//   color: #ef4444;
//   text-align: left;
//   border-radius: 6px;
//   font-size: 0.875rem;
//   cursor: pointer;
//   transition: all 0.2s ease;

//   &:hover {
//     background: rgba(239, 68, 68, 0.1);
//   }
// `;

// export const DropdownDivider = styled.div`
//   height: 1px;
//   background: rgba(139, 92, 246, 0.2);
//   margin: 0.5rem 0;
// `;

// export const MobileMenuButton = styled.button`
//   display: none;
//   background: none;
//   border: none;
//   color: #cbd5e1;
//   font-size: 1.5rem;
//   cursor: pointer;
//   padding: 0.5rem;

//   @media (max-width: 768px) {
//     display: flex;
//   }

//   &:hover {
//     color: #0ea5e9;
//   }
// `;

// export const MobileMenu = styled.div<{ $isOpen: boolean }>`
//   display: ${(props) => (props.$isOpen ? "flex" : "none")};
//   flex-direction: column;
//   position: absolute;
//   top: 100%;
//   left: 0;
//   right: 0;
//   background: rgba(15, 23, 42, 0.98);
//   backdrop-filter: blur(20px);
//   border-bottom: 1px solid #334155;
//   padding: 1rem;
//   z-index: 1000;

//   @media (min-width: 769px) {
//     display: none;
//   }
// `;

// export const MobileNavLink = styled(Link)<{ $isActive?: boolean }>`
//   color: ${(props) => (props.$isActive ? "#0ea5e9" : "#cbd5e1")};
//   text-decoration: none;
//   font-weight: 500;
//   padding: 1rem;
//   border-radius: 8px;
//   transition: all 0.3s ease;

//   &:hover {
//     background: rgba(30, 41, 59, 0.5);
//     color: #0ea5e9;
//   }

//   ${(props) =>
//     props.$isActive &&
//     `
//     background: rgba(30, 41, 59, 0.5);
//     color: #0ea5e9;
//   `}
// `;

// export const AuthSection = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;

//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// export const MobileAuthSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   padding: 1rem;
//   border-top: 1px solid #334155;
//   margin-top: 0.5rem;
// `;
"use client";
import styled from "styled-components";
import Link from "next/link";

export const Nav = styled.nav<{ $isMobile?: boolean }>`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #334155;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 1rem;

  ${(props) =>
    props.$isMobile &&
    `
    position: sticky;
    top: 0;
    z-index: 1000;
  `}
`;

export const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

export const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: gradientShift 8s ease infinite;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#cbd5e1")};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &:hover {
    color: #0ea5e9;
  }

  ${(props) =>
    props.$isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
      border-radius: 2px;
    }
  `}
`;

export const GradientButton = styled(Link)`
  background: #a84eff;
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: gradientShift 8s ease infinite;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    border-color: rgba(139, 92, 246, 0.6);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export const SecondaryGradientButton = styled(Link)`
  background: transparent;
  border: 1px solid;
  border-image: linear-gradient(45deg, #0ea5e9, #8b5cf6) 1;
  color: #cbd5e1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: linear-gradient(
      45deg,
      rgba(14, 165, 233, 0.1),
      rgba(139, 92, 246, 0.1)
    );
    color: white;
    transform: translateY(-1px);
  }
`;

export const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

export const UserAvatar = styled.div<{ $isMobile?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  transition: transform 0.2s ease;

  ${UserMenu}:hover & {
    transform: scale(1.05);
  }

  ${(props) =>
    props.$isMobile &&
    `
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  `}
`;

export const UserDropdown = styled.div<{
  $isOpen: boolean;
  $isMobile?: boolean;
}>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  min-width: 200px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  z-index: 1001;

  /* Create invisible gap to prevent hover interruption */
  &::before {
    content: "";
    position: absolute;
    top: -0.5rem;
    left: 0;
    right: 0;
    height: 0.5rem;
    background: transparent;
  }

  ${(props) =>
    props.$isMobile &&
    `
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
  `}
`;

export const UserInfo = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  margin-bottom: 0.5rem;
`;

export const UserName = styled.div`
  color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const UserEmail = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem;
  color: #e2e8f0;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #f8fafc;
  }
`;

export const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #ef4444;
  text-align: left;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(139, 92, 246, 0.2);
  margin: 0.5rem 0;
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    color: #0ea5e9;
  }
`;

export const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #334155;
  padding: 1rem;
  z-index: 1000;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileNavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#cbd5e1")};
  text-decoration: none;
  font-weight: 500;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.5);
    color: #0ea5e9;
  }

  ${(props) =>
    props.$isActive &&
    `
    background: rgba(30, 41, 59, 0.5);
    color: #0ea5e9;
  `}
`;

export const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileAuthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #334155;
  margin-top: 0.5rem;
`;

// New Mobile Bottom Navigation Styles
export const MobileBottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid #334155;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem 0;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileBottomNavItem = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? "white" : "#94a3b8")};
  transition: all 0.3s ease;
  flex: 1;
  min-height: 60px;
  border-radius: 8px;
  margin: 0 0.25rem;

  &:active {
    transform: scale(0.95);
    background: rgba(14, 165, 233, 0.1);
  }

  ${(props) =>
    props.$isActive &&
    `
    color: white;
    background: rgba(14, 165, 233, 0.1);
  `}
`;

export const MobileNavIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  background-color: transparent !important;
`;

export const MobileNavLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  transition: all 0.3s ease;
`;

export const PlanButton = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#ffffff")};
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  border-radius: 16px;
  width: 70px;
  height: 70px;
  margin-top: -25px;
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
  transition: all 0.3s ease;
  flex: none;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.6);
  }

  ${(props) =>
    props.$isActive &&
    `
    box-shadow: 0 8px 30px rgba(14, 165, 233, 0.6);
  `}

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #0ea5e9);
    border-radius: 18px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const PlanButtonIcon = styled.div`
  font-size: 1.75rem;
  margin-bottom: 0.1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;
