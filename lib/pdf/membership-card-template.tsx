import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface MembershipCardData {
  id: string;
  name: string;
  membershipId: string;
  subClubName: string;
  registerNumber: string;
  department: string;
  year: string;
  gender?: string;
  issuedDate?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#F8FAFC",
    fontFamily: "Helvetica",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardHeader: {
    backgroundColor: "#5B50E5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "heavy",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  subHeaderTitle: {
    color: "#E0E7FF",
    fontSize: 7,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cardBody: {
    padding: 12,
    flexDirection: "row",
    flex: 1,
  },
  avatarPlaceholder: {
    width: 60,
    height: 75,
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B50E5",
  },
  detailsCol: {
    flex: 1,
    justifyContent: "space-between",
  },
  memberName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0F172A",
  },
  membershipIdBadge: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#5B50E5",
    backgroundColor: "#EEF2FF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 2,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 7,
    color: "#64748B",
    width: 55,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  detailVal: {
    fontSize: 7.5,
    color: "#334155",
    fontWeight: "bold",
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  footerText: {
    fontSize: 6.5,
    color: "#94A3B8",
  },
  verifiedSeal: {
    fontSize: 6.5,
    color: "#16A34A",
    fontWeight: "bold",
  },
});

export function MembershipCardDocument({ cards }: { cards: MembershipCardData[] }) {
  // 4 cards per A4 page
  const chunkSize = 4;
  const pages: MembershipCardData[][] = [];
  for (let i = 0; i < cards.length; i += chunkSize) {
    pages.push(cards.slice(i, i + chunkSize));
  }

  return (
    <Document title="Vistara Student Club — Membership Cards">
      {pages.map((group, pIndex) => (
        <Page key={pIndex} size="A4" style={styles.page}>
          <View style={styles.grid}>
            {group.map((card) => {
              const initials = card.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <View key={card.id} style={styles.card}>
                  {/* Header */}
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.headerTitle}>VISTARA CONNECT</Text>
                      <Text style={styles.subHeaderTitle}>Student Club Membership</Text>
                    </View>
                    <Text style={{ color: "#FFFFFF", fontSize: 8, fontWeight: "bold" }}>
                      2025-26
                    </Text>
                  </View>

                  {/* Body */}
                  <View style={styles.cardBody}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarInitials}>{initials || "VC"}</Text>
                    </View>
                    <View style={styles.detailsCol}>
                      <View>
                        <Text style={styles.memberName}>{card.name}</Text>
                        <Text style={styles.membershipIdBadge}>{card.membershipId}</Text>
                      </View>

                      <View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Sub-Club:</Text>
                          <Text style={styles.detailVal}>{card.subClubName}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Reg No:</Text>
                          <Text style={styles.detailVal}>{card.registerNumber}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Dept/Year:</Text>
                          <Text style={styles.detailVal}>
                            {card.department} • {card.year}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>Official Digital Pass • VSC</Text>
                    <Text style={styles.verifiedSeal}>✓ VERIFIED MEMBER</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
}
