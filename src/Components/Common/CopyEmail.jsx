import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

const writeToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // The clipboard API only exists on https and localhost.
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(area);
  if (!copied) throw new Error("Copy failed");
};

/** An email address with a copy icon. Safe inside clickable rows and buttons: the icon isn't a <button> and doesn't pass its click on. */
const CopyEmail = ({ email, fallback = "—", className = "" }) => {
  const [copied, setCopied] = useState(false);

  if (!email) return <span className={className}>{fallback}</span>;

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await writeToClipboard(email);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy email");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") handleCopy(e);
  };

  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 ${className}`}>
      <span className="min-w-0 truncate" title={email}>{email}</span>
      <span
        role="button"
        tabIndex={0}
        title="Copy email"
        aria-label={`Copy email ${email}`}
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        className="shrink-0 cursor-pointer rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-brand-600"
      >
        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      </span>
    </span>
  );
};

export default CopyEmail;
