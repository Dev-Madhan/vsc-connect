import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { GenerateODInput, ODStudentRow } from '@/lib/validations/document.schema';

// ── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Base Page Settings (Updated to Serif Font)
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#000000',
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },

  // ── Header Banner (Page 1 Only) ─────────────────────────────────────────────
  headerImage: {
    width: '100%',
    height: 95,
    objectFit: 'contain',
    marginBottom: 16,
  },

  // ── Page 1: Request Letter Styles ──────────────────────────────────────────
  docTitlePage1: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  dateRowPage1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  dateTextPage1: { 
    fontSize: 11,
  },
  blockLabelPage1: {
    fontSize: 11.5,
    fontFamily: 'Times-Bold',
    marginBottom: 4,
  },
  blockTextPage1: {
    fontSize: 11.5,
    marginBottom: 2,
  },
  sectionGapPage1: { 
    marginBottom: 16,
  },
  subjectRowPage1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  subjectLabelPage1: { 
    fontFamily: 'Times-Bold', 
    fontSize: 11.5,
  },
  subjectTextPage1:  { 
    fontSize: 11.5, 
    flex: 1,
  },
  thinDividerPage1: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    marginVertical: 10,
  },
  salutationPage1: { 
    fontSize: 11.5, 
    marginBottom: 12,
  },
  bodyTextPage1: {
    fontSize: 11.5,
    textAlign: 'justify',
    marginBottom: 12,
    lineHeight: 1.5,
  },
  closingBlockPage1: { 
    marginTop: 24,
  },
  closingTextPage1:  { 
    fontSize: 11.5, 
    marginBottom: 4,
  },
  signatureBlockPage1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  signatureRightPage1: { 
    textAlign: 'right',
  },
  signatureNamePage1:  { 
    fontSize: 11.5, 
    fontFamily: 'Times-Bold',
  },
  signatureTitlePage1: { 
    fontSize: 11.5,
  },

  // ── Page 2+: Sub-Club Tables Section ────────────────────────────────────────
  subClubBlock: {
    marginTop: 8,
    marginBottom: 10,
  },
  clubHeading: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  
  // Reduced table width to 85% to increase space on the right side
  table: {
    width: '87%',
    marginBottom: 8,
    borderStyle: 'solid',
    borderWidth: 0.75,
    borderColor: '#000000',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.75,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#000000',
    alignItems: 'center',
  },

  // Table Column Styles
  colSno:  { width: '10%', paddingVertical: 1, paddingHorizontal: 2, borderRightWidth: 0.5, borderRightColor: '#000' },
  colName: { width: '42%', paddingVertical: 1, paddingHorizontal: 3, borderRightWidth: 0.5, borderRightColor: '#000' },
  colVm:   { width: '18%', paddingVertical: 1, paddingHorizontal: 2, borderRightWidth: 0.5, borderRightColor: '#000' },
  colDept: { width: '16%', paddingVertical: 1, paddingHorizontal: 2, borderRightWidth: 0.5, borderRightColor: '#000' },
  colYear: { width: '14%', paddingVertical: 1, paddingHorizontal: 2 },

  // Text styling using Times-Roman with controlled line heights
  thText: { 
    fontSize: 8.5, 
    fontFamily: 'Times-Bold', 
    textAlign: 'center',
    lineHeight: 1.1,
  },
  tdText: { 
    fontSize: 8.5, 
    fontFamily: 'Times-Roman',
    textAlign: 'center',
    lineHeight: 1.1,
  },

  // Department labels block below tables
  deptLabelsRow: {
    flexDirection: 'column',
    marginTop: 10,
    gap: 4,
  },
  deptLabel: {
    fontSize: 8.5,
    fontFamily: 'Times-Bold',
  },

  // Page numbering
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: '#666',
    fontFamily: 'Times-Roman',
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

type EnrichedStudent = ODStudentRow & { subClubName: string };

function groupByClub(students: EnrichedStudent[]): Map<string, EnrichedStudent[]> {
  const map = new Map<string, EnrichedStudent[]>();
  for (const s of students) {
    if (!map.has(s.subClubName)) map.set(s.subClubName, []);
    map.get(s.subClubName)!.push(s);
  }
  return map;
}

// ── Root Document Component ───────────────────────────────────────────────────

export interface ODDocumentProps {
  data: GenerateODInput;
  subClubNames: Record<string, string>;
  logoDataUrl: string;
}

export function ODDocument({ data, subClubNames, logoDataUrl }: ODDocumentProps) {
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const enriched: EnrichedStudent[] = data.students.map((s) => ({
    ...s,
    subClubName: subClubNames[s.subClubId] ?? s.subClubId,
  }));

  const grouped = groupByClub(enriched);
  const allDepts = [...new Set(enriched.map((s) => s.department.toUpperCase()))];

  return (
    <Document title="OD Request Letter" author={data.fromName} creator="VSC Connect">
      {/* ── PAGE 1: Request Letter Only ────────────────────────────────────── */}
      <Page size="A4" style={S.page}>
        {/* Banner Logo */}
        {logoDataUrl ? <Image src={logoDataUrl} style={S.headerImage} /> : null}

        {/* Title */}
        <Text style={S.docTitlePage1}>REQUEST LETTER FOR ON DUTY PERMISSION</Text>

        {/* Date */}
        <View style={S.dateRowPage1}>
          <Text style={S.dateTextPage1}>{formattedToday}</Text>
        </View>

        {/* FROM */}
        <View style={S.sectionGapPage1}>
          <Text style={S.blockLabelPage1}>FROM:</Text>
          {data.fromName.split('\n').map((line, i) => (
            <Text key={i} style={S.blockTextPage1}>{line}</Text>
          ))}
        </View>

        {/* TO */}
        <View style={S.sectionGapPage1}>
          <Text style={S.blockLabelPage1}>TO:</Text>
          <Text style={S.blockTextPage1}>The Principal</Text>
          <Text style={S.blockTextPage1}>
            Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College,
          </Text>
          <Text style={S.blockTextPage1}>Avadi, Chennai.</Text>
        </View>

        {/* Subject */}
        <View style={S.subjectRowPage1}>
          <Text style={S.subjectLabelPage1}>Subject: </Text>
          <Text style={S.subjectTextPage1}>{data.subject}</Text>
        </View>

        <View style={S.thinDividerPage1} />

        {/* Salutation + Body */}
        <Text style={S.salutationPage1}>Respected Sir,</Text>

        <Text style={S.bodyTextPage1}>{data.description}</Text>

        <Text style={S.bodyTextPage1}>
          {'We kindly request you to consider our application and grant the necessary On Duty permission from '}
          <Text style={{ fontFamily: 'Times-Bold' }}>{formatDate(data.dateFrom)}</Text>
          {' to '}
          <Text style={{ fontFamily: 'Times-Bold' }}>{formatDate(data.dateTo)}</Text>
          {'.'}
        </Text>

        {/* Closing */}
        <View style={S.closingBlockPage1}>
          <Text style={{ ...S.closingTextPage1, textAlign: 'center' }}>Thanking you,</Text>
        </View>

        {/* Signature */}
        <View style={S.signatureBlockPage1}>
          <View style={S.signatureRightPage1}>
            <Text style={S.closingTextPage1}>Yours faithfully,</Text>
            <Text style={S.signatureNamePage1}>{data.fromName.split('\n')[0]}</Text>
            <Text style={S.signatureTitlePage1}>Student President</Text>
          </View>
        </View>

        {/* Page 1 Footer */}
        <Text
          style={S.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ── PAGE 2+: Tables flowing sequentially ───────────────────────────── */}
      <Page size="A4" style={S.page}>
        {/* Sequential Sub-Club Tables */}
        {Array.from(grouped.entries()).map(([clubName, students]) => (
          <View key={clubName} style={S.subClubBlock} wrap={false}>
            <Text style={S.clubHeading}>{clubName.toUpperCase()}</Text>

            <View style={S.table}>
              <View style={S.tableHeaderRow}>
                <View style={S.colSno}><Text style={S.thText}>S.No</Text></View>
                <View style={S.colName}><Text style={S.thText}>Student Name</Text></View>
                <View style={S.colVm}><Text style={S.thText}>Vm No</Text></View>
                <View style={S.colDept}><Text style={S.thText}>Department</Text></View>
                <View style={S.colYear}><Text style={S.thText}>Year</Text></View>
              </View>

              {students.map((s, i) => (
                <View key={i} style={S.tableRow}>
                  <View style={S.colSno}><Text style={S.tdText}>{i + 1}</Text></View>
                  <View style={S.colName}><Text style={S.tdText}>{s.name.toUpperCase()}</Text></View>
                  <View style={S.colVm}><Text style={S.tdText}>{s.vmNumber}</Text></View>
                  <View style={S.colDept}><Text style={S.tdText}>{s.department.toUpperCase()}</Text></View>
                  <View style={S.colYear}><Text style={S.tdText}>{s.year}</Text></View>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Department Abbreviations Summary */}
        <View style={S.deptLabelsRow} wrap={false}>
          {allDepts.map((d) => (
            <Text key={d} style={S.deptLabel}>{d}:</Text>
          ))}
        </View>

        {/* Footer */}
        <Text
          style={S.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}