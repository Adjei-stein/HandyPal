import { useRouter } from 'expo-router';
import { AlertTriangle, Bookmark, Calendar, ChevronLeft, Clock, MapPin, Share2, ShieldCheck, Star } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const JobDetails = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Job Title and Badges */}
        <View style={styles.section}>
          <Text style={styles.jobTitle}>Need a Professional Car Wash</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.jobTypeBadge]}>
              <Text style={styles.badgeText}>Physical</Text>
            </View>
            <View style={[styles.badge, styles.statusBadge]}>
              <Text style={styles.badgeText}>Open</Text>
            </View>
          </View>
        </View>

        {/* Pay & Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay & Time</Text>
          <View style={styles.infoRow}>
            <Text style={styles.payAmount}>GH₵50</Text>
            <Text style={styles.infoText}>Fixed</Text>
          </View>
          <Text style={styles.infoText}>Duration: 1 hour</Text>
        </View>

        {/* Schedule & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule & Location</Text>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#9ca3af" />
            <Text style={styles.infoText}>Today, 12th Sept</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color="#9ca3af" />
            <Text style={styles.infoText}>Start Time: 2:00 PM</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={16} color="#9ca3af" />
            <Text style={styles.infoText}>On-site</Text>
          </View>
          <Text style={styles.addressText}>123 Kojo Street, Accra</Text>
          <View style={styles.mapPreview} />
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>
            Looking for a meticulous and efficient person to provide a thorough interior and exterior car wash for a sedan.
          </Text>
        </View>

        {/* Responsibilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsibilities</Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Exterior washing and drying</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Interior vacuuming and cleaning</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Window and mirror cleaning</Text>
          </View>
        </View>

        {/* Rules & Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules & Conditions</Text>
          <Text style={styles.descriptionText}>
            Must arrive on time. Please handle the vehicle with care.
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>Car Washing</Text>
            <Text style={styles.tag}>Attention to Detail</Text>
          </View>
          <Text style={styles.infoText}>Experience Level: Beginner</Text>
        </View>

        {/* Supplies & Logistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supplies & Logistics</Text>
          <Text style={styles.infoText}>Tools Provided: Yes</Text>
          <Text style={styles.infoText}>Transport Covered: No</Text>
        </View>

        {/* Application Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.infoText}>Application Type: Instant Accept</Text>
          <Text style={styles.infoText}>Number of Workers Needed: 1</Text>
        </View>

        {/* Posted By */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posted By</Text>
          <View style={styles.posterInfo}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
            <View>
              <Text style={styles.posterName}>John Doe</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#facc15" fill="#facc15" />
                <Text style={styles.ratingText}>4.8 (12 jobs)</Text>
              </View>
            </View>
            <ShieldCheck size={24} color="#34d399" />
          </View>
          <TouchableOpacity style={styles.viewProfileButton}>
            <Text style={styles.viewProfileButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Images / Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.imageGrid}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.jobImage} />
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.jobImage} />
          </View>
        </View>

        {/* Safety & System Actions */}
        <View style={styles.safetySection}>
          <TouchableOpacity style={styles.reportButton}>
            <AlertTriangle size={16} color="#ef4444" />
            <Text style={styles.reportButtonText}>Report Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Bookmark size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Accept Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Share2 size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  scrollContainer: {
    paddingBottom: 100, // Space for the sticky footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  jobTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  jobTypeBadge: {
    backgroundColor: '#3b82f6',
  },
  statusBadge: {
    backgroundColor: '#22c55e',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#a1a1aa',
    fontSize: 14,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  payAmount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  infoText: {
    color: '#d4d4d8',
    fontSize: 16,
    marginLeft: 8,
  },
  addressText: {
    color: '#d4d4d8',
    fontSize: 16,
    marginTop: 4,
  },
  mapPreview: {
    height: 150,
    backgroundColor: '#27272a',
    borderRadius: 8,
    marginTop: 8,
  },
  descriptionText: {
    color: '#d4d4d8',
    fontSize: 16,
    lineHeight: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    color: '#d4d4d8',
    fontSize: 16,
    marginRight: 8,
  },
  bulletText: {
    color: '#d4d4d8',
    fontSize: 16,
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#3f3f46',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  posterName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#a1a1aa',
    marginLeft: 4,
  },
  viewProfileButton: {
    marginTop: 12,
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewProfileButtonText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  jobImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  safetySection: {
    padding: 16,
    alignItems: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#ef4444',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#18181b',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 12,
    backgroundColor: '#27272a',
    borderRadius: 24,
  },
});

export default JobDetails;