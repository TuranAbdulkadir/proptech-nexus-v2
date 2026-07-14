"""
PropTech-Nexus v2 — Sovereign Audit PDF Generator
Generates a professional, branded PDF report for property investment audits.
"""
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Paragraph, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from typing import Dict, Any


# Brand colors
BRAND_DARK = HexColor("#0f172a")
BRAND_GREEN = HexColor("#22c55e")
BRAND_RED = HexColor("#ef4444")
BRAND_YELLOW = HexColor("#eab308")
BRAND_SLATE = HexColor("#94a3b8")
BRAND_WHITE = HexColor("#f8fafc")


def generate_audit_pdf(property_id: str, address: str, audit_data: Dict[str, Any]) -> bytes:
    """
    Generates a branded sovereign audit PDF report.
    Returns the PDF as bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'AuditTitle',
        parent=styles['Title'],
        fontSize=22,
        textColor=BRAND_DARK,
        spaceAfter=6*mm,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    subtitle_style = ParagraphStyle(
        'AuditSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=BRAND_SLATE,
        spaceAfter=4*mm,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )

    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=BRAND_DARK,
        spaceBefore=6*mm,
        spaceAfter=3*mm,
        fontName='Helvetica-Bold'
    )

    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=10,
        textColor=BRAND_DARK,
        fontName='Helvetica'
    )

    elements = []

    # ── Header ──
    elements.append(Paragraph("PROPTECH NEXUS v2", title_style))
    elements.append(Paragraph("SOVEREIGN AUDIT REPORT", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=BRAND_GREEN, spaceAfter=4*mm))

    # ── Property Info ──
    elements.append(Paragraph("Property Information", section_style))
    prop_data = [
        ["Property ID", property_id],
        ["Address", address],
    ]
    prop_table = Table(prop_data, colWidths=[60*mm, 110*mm])
    prop_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), HexColor("#e2e8f0")),
        ('TEXTCOLOR', (0, 0), (-1, -1), BRAND_DARK),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, BRAND_SLATE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
    ]))
    elements.append(prop_table)
    elements.append(Spacer(1, 4*mm))

    # ── Financial Analysis ──
    elements.append(Paragraph("Financial Analysis", section_style))
    fin_data = [
        ["Metric", "Value"],
        ["Gross Rent (Monthly)", f"${audit_data.get('grossRent', 0):,.2f}"],
        ["Property Tax (Monthly)", f"-${audit_data.get('propertyTax', 0):,.2f}"],
        ["HOA Fee", f"-${audit_data.get('hoaFee', 0):,.2f}"],
        ["Vacancy Buffer (5%)", f"-${audit_data.get('vacancyBuffer', 0):,.2f}"],
        ["Net Cashflow (Monthly)", f"${audit_data.get('netCashflow', 0):,.2f}"],
        ["Annualized ROI", f"{audit_data.get('annualizedRoi', 0):.2f}%"],
    ]
    fin_table = Table(fin_data, colWidths=[85*mm, 85*mm])
    fin_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BRAND_DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), BRAND_WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (0, -1), HexColor("#f1f5f9")),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (-1, -1), BRAND_DARK),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, BRAND_SLATE),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3*mm),
    ]))
    elements.append(fin_table)
    elements.append(Spacer(1, 4*mm))

    # ── Cyber-Physical Security ──
    elements.append(Paragraph("Cyber-Physical Security Intelligence", section_style))
    sec_data = [
        ["Metric", "Value"],
        ["Security Score", f"{audit_data.get('securityScore', 'N/A')}/100"],
        ["Crime Index", str(audit_data.get('crimeIndex', 'N/A'))],
        ["Distance to Police Station", f"{audit_data.get('distanceToPolice', 'N/A')} mi"],
        ["Open IoT Ports", ", ".join(audit_data.get('openIotPorts', [])) or "None Detected"],
    ]
    sec_table = Table(sec_data, colWidths=[85*mm, 85*mm])
    sec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BRAND_RED),
        ('TEXTCOLOR', (0, 0), (-1, 0), BRAND_WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (0, -1), HexColor("#fef2f2")),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (-1, -1), BRAND_DARK),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, BRAND_SLATE),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3*mm),
    ]))
    elements.append(sec_table)
    elements.append(Spacer(1, 4*mm))

    # ── Climate & Hazard ──
    elements.append(Paragraph("Climate & Hazard Assessment", section_style))
    clim_data = [
        ["Metric", "Value"],
        ["FEMA Flood Zone", audit_data.get('floodZone', 'N/A')],
        ["Seismic Safety Score", f"{audit_data.get('seismicSafety', 'N/A')}/100"],
    ]
    clim_table = Table(clim_data, colWidths=[85*mm, 85*mm])
    clim_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BRAND_YELLOW),
        ('TEXTCOLOR', (0, 0), (-1, 0), BRAND_DARK),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (0, -1), HexColor("#fefce8")),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (-1, -1), BRAND_DARK),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, BRAND_SLATE),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3*mm),
    ]))
    elements.append(clim_table)
    elements.append(Spacer(1, 4*mm))

    # ── AI Structural Defects ──
    defects = audit_data.get('structuralDefects', [])
    elements.append(Paragraph("AI Structural Defect Analysis (Gemini Pro Vision)", section_style))
    if defects:
        defect_data = [["#", "Type", "Confidence"]]
        for i, d in enumerate(defects):
            defect_data.append([str(i + 1), d.get('type', 'Unknown'), f"{d.get('confidence', 0) * 100:.0f}%"])
        def_table = Table(defect_data, colWidths=[15*mm, 100*mm, 55*mm])
        def_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), BRAND_RED),
            ('TEXTCOLOR', (0, 0), (-1, 0), BRAND_WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, 1), (-1, -1), BRAND_DARK),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 0.5, BRAND_SLATE),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (2, 0), (2, -1), 'CENTER'),
            ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
            ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
        ]))
        elements.append(def_table)
    else:
        elements.append(Paragraph("No structural defects detected.", body_style))

    elements.append(Spacer(1, 8*mm))
    elements.append(HRFlowable(width="100%", thickness=1, color=BRAND_GREEN, spaceBefore=4*mm))

    footer_style = ParagraphStyle(
        'Footer', parent=styles['Normal'], fontSize=8,
        textColor=BRAND_SLATE, alignment=TA_CENTER, fontName='Helvetica'
    )
    elements.append(Paragraph(
        "Generated by PropTech-Nexus v2 — The Global Sentinel | Autonomous AI Audit Engine",
        footer_style
    ))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
