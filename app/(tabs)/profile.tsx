import UserProfile from '@/components/userProfile';
import { useListings } from '@/context/ListingsContext';
import { currentUser } from '@/data/mockData';

export default function ProfileScreen() {
  const { listings } = useListings();
  return <UserProfile user={currentUser} listings={listings.filter(l => l.postedBy.id === currentUser.id)} />;
}
