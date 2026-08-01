import { jsPDF } from "jspdf";
import type { Person, TimelineEvent } from "@/lib/types";
import {
  APP_NAME,
  APP_TAGLINE,
  JOURNEY_TYPES,
  PLATFORM_META,
} from "@/lib/constants";
import { formatDateLong, yearOf } from "@/lib/format";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 46;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK = "#2E2A26";
const INK_SECONDARY = "#564F48";
const INK_MUTED = "#807870";
const LINE = "#E8E0D5";
const GREEN = "#788567";

function journeyLabel(journeyType: Person["journeyType"]): string {
  return JOURNEY_TYPES.find((t) => t.id === journeyType)?.label ?? "";
}

function eventDate(e: TimelineEvent): string {
  const d = new Date(e.date);
  if (Number.isNaN(d.getTime())) return e.date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function exportPeoplePdf(people: Person[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  let y = MARGIN;

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - 44) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const setInk = (hex: string) => doc.setTextColor(hex);

  const rule = () => {
    setInk(LINE);
    doc.setDrawColor(LINE);
    doc.setLineWidth(0.75);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 14;
  };

  const heading = (text: string) => {
    ensure(26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    setInk(INK);
    doc.text(text, MARGIN, y);
    y += 22;
  };

  const paragraph = (
    text: string,
    size = 10,
    color = INK_SECONDARY,
    italic = false,
    gap = 4
  ) => {
    doc.setFont("helvetica", italic ? "italic" : "normal");
    doc.setFontSize(size);
    setInk(color);
    const lines = doc.splitTextToSize(text, CONTENT_W) as string[];
    ensure(lines.length * 13);
    doc.text(lines, MARGIN, y);
    y += lines.length * 13 + gap;
  };

  const detail = (label: string, value: string) => {
    if (!value) return;
    ensure(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setInk(INK_MUTED);
    doc.text(label.toUpperCase(), MARGIN, y);
    y += 11;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setInk(INK);
    const lines = doc.splitTextToSize(value, CONTENT_W) as string[];
    ensure(lines.length * 13);
    doc.text(lines, MARGIN, y);
    y += lines.length * 13 + 7;
  };

  const sectionLabel = (text: string) => {
    ensure(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setInk(GREEN);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 13;
  };

  const item = (title: string, sub?: string) => {
    ensure(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setInk(INK);
    doc.text(title, MARGIN, y);
    y += 13;
    if (sub) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setInk(INK_SECONDARY);
      const lines = doc.splitTextToSize(sub, CONTENT_W - 20) as string[];
      ensure(lines.length * 12);
      doc.text(lines, MARGIN + 14, y);
      y += lines.length * 12 + 5;
    } else {
      y += 5;
    }
  };

  // Cover / header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setInk(INK);
  doc.text(APP_NAME, MARGIN, y);
  y += 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  setInk(INK_MUTED);
  doc.text(APP_TAGLINE, MARGIN, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setInk(INK_MUTED);
  doc.text(
    `A quiet record of ${people.length} ${people.length === 1 ? "person" : "people"} · ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    MARGIN,
    y
  );
  y += 8;
  rule();

  if (people.length === 0) {
    paragraph("No one in the book yet. The first name comes when you remember someone.", 11, INK_SECONDARY, true);
    doc.save(`${APP_NAME.toLowerCase()}-export.pdf`);
    return;
  }

  people.forEach((p, idx) => {
    if (idx > 0) ensure(60);
    heading(p.name);

    const meta = [p.username ? `@${p.username}` : "", PLATFORM_META[p.platform].label]
      .filter(Boolean)
      .join(" · ");
    if (meta) paragraph(meta, 9, INK_MUTED, false, 8);

    if (p.bio) paragraph(p.bio, 10.5, INK_SECONDARY, true, 8);

    const journey = journeyLabel(p.journeyType);
    if (journey) {
      ensure(20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setInk(GREEN);
      doc.text(journey, MARGIN, y);
      y += 8;
    }
    if (p.tags.length > 0) {
      paragraph(p.tags.join("  ·  "), 9, INK_MUTED, false, 6);
    }
    rule();

    sectionLabel("Contact details");
    if (p.platform !== "unknown") detail("Platform", PLATFORM_META[p.platform].label);
    if (p.profileUrl) detail("Profile", p.profileUrl);
    if (p.website) detail("Website", p.website);
    if (p.username) detail("Handle", `@${p.username}`);
    if (p.whereMet) detail("Where you met", p.whereMet);
    if (p.dateMet) detail("When you met", formatDateLong(p.dateMet));
    if (p.birthday) detail("Birthday", formatDateLong(p.birthday));
    if (p.lastInteraction) detail("Last contact", formatDateLong(p.lastInteraction));
    if (p.followUp || p.prayFor) {
      const flags = [p.followUp ? "Reach out later" : "", p.prayFor ? "Pray for them" : ""].filter(Boolean);
      detail("Keeping", flags.join(", "));
    }
    if (p.whyTheyMatter) {
      sectionLabel("Why they matter");
      paragraph(p.whyTheyMatter, 10, INK_SECONDARY, false, 4);
    }
    if (p.notes) {
      sectionLabel("Journey notes");
      paragraph(p.notes, 10, INK_SECONDARY, false, 4);
    }

    if (p.prayerIntentions.length > 0) {
      sectionLabel("Prayer intentions");
      p.prayerIntentions.forEach((pi) => {
        item(pi.text, pi.date ? yearOf(pi.date) : undefined);
      });
    }

    if (p.timeline.length > 0) {
      sectionLabel("Memories");
      p.timeline
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach((e) => {
          item(`${e.title} — ${eventDate(e)}`, e.note);
        });
    }

    rule();
  });

  // Page numbers
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setInk(INK_MUTED);
    doc.text(`${i} / ${pages}`, PAGE_W / 2, PAGE_H - 24, { align: "center" });
  }

  doc.save(`${APP_NAME.toLowerCase()}-export.pdf`);
}
