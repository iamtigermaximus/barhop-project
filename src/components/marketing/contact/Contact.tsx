"use client";
import { useState } from "react";
import styled from "styled-components";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

export const Page = styled.div`
  padding: 2rem 1rem 10rem;
  margin: 0 auto;
  background: #0f172a;
  min-height: calc(100vh - 70px);
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem 10rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: #f8fafc;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
`;

export const Description = styled.p`
  font-size: 1.2rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }
`;

export const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: transparent !important;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 0 0.5rem;
  }
`;

export const ContactFormSection = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const ContactInfoSection = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 1rem;
  font-weight: 600;
`;

export const SectionDescription = styled.p`
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

export const Required = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const SubmitButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.$loading
      ? "linear-gradient(45deg, #6b7280, #4b5563)"
      : "linear-gradient(45deg, #8b5cf6, #a855f7)"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
`;

export const ContactInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const ContactIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const ContactContent = styled.div`
  flex: 1;
`;

export const ContactTitle = styled.h3`
  font-size: 1rem;
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

export const ContactText = styled.p`
  color: #94a3b8;
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const ContactLink = styled.a`
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;

  &:hover {
    color: #a855f7;
    text-decoration: underline;
  }
`;

export const BusinessHours = styled.div`
  margin-top: 0.5rem;
`;

export const HoursRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
`;

export const HoursDay = styled.span`
  color: #e2e8f0;
`;

export const HoursTime = styled.span`
  color: #94a3b8;
`;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData);

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Title>Get in Touch</Title>
      <Description>
        Have questions about Hoppr? We&apos;d love to hear from you. Send us a
        message and we&apos;ll respond as soon as possible.
      </Description>

      <ContactContainer>
        {/* Contact Form */}
        <ContactFormSection>
          <SectionTitle>Send us a Message</SectionTitle>
          <SectionDescription>
            Fill out the form below and we&apos;ll get back to you within 24
            hours.
          </SectionDescription>

          {success && (
            <SuccessMessage>
              ✅ Thank you! Your message has been sent successfully. We&apos;ll
              get back to you soon.
            </SuccessMessage>
          )}

          {error && <ErrorMessage>❌ {error}</ErrorMessage>}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">
                Name <Required>*</Required>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">
                Email <Required>*</Required>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">
                Message <Required>*</Required>
              </Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                required
              />
            </FormGroup>

            <SubmitButton type="submit" $loading={loading} disabled={loading}>
              {loading ? <HopprLoader /> : "Send Message"}
            </SubmitButton>
          </form>
        </ContactFormSection>

        {/* Contact Information */}
        <ContactInfoSection>
          <SectionTitle>Contact Information</SectionTitle>
          <SectionDescription>
            Reach out to us directly through any of these channels.
          </SectionDescription>

          <ContactInfoList>
            <ContactItem>
              <ContactIcon>
                <FaEnvelope size={20} />
              </ContactIcon>
              <ContactContent>
                <ContactTitle>Email</ContactTitle>
                <ContactText>
                  <ContactLink href="mailto:support@hoppr.com">
                    support@hoppr.com
                  </ContactLink>
                </ContactText>
                <ContactText
                  style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
                >
                  General inquiries and support
                </ContactText>
              </ContactContent>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaPhone size={18} />
              </ContactIcon>
              <ContactContent>
                <ContactTitle>Phone</ContactTitle>
                <ContactText>
                  <ContactLink href="tel:+358501234567">
                    +358 50 123 4567
                  </ContactLink>
                </ContactText>
                <ContactText
                  style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
                >
                  Emergency support line
                </ContactText>
              </ContactContent>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaMapMarkerAlt size={18} />
              </ContactIcon>
              <ContactContent>
                <ContactTitle>Office</ContactTitle>
                <ContactText>Helsinki City Center</ContactText>
                <ContactText>00100 Helsinki</ContactText>
                <ContactText>Finland</ContactText>
              </ContactContent>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaClock size={18} />
              </ContactIcon>
              <ContactContent>
                <ContactTitle>Business Hours</ContactTitle>
                <BusinessHours>
                  <HoursRow>
                    <HoursDay>Monday - Friday</HoursDay>
                    <HoursTime>9:00 AM - 6:00 PM EET</HoursTime>
                  </HoursRow>
                  <HoursRow>
                    <HoursDay>Saturday</HoursDay>
                    <HoursTime>10:00 AM - 4:00 PM EET</HoursTime>
                  </HoursRow>
                  <HoursRow>
                    <HoursDay>Sunday</HoursDay>
                    <HoursTime style={{ color: "#ef4444" }}>Closed</HoursTime>
                  </HoursRow>
                </BusinessHours>
              </ContactContent>
            </ContactItem>
          </ContactInfoList>
        </ContactInfoSection>
      </ContactContainer>
    </Page>
  );
}
