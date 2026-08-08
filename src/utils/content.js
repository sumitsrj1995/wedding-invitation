export const defaultWeddingSlug = 'demo-wedding';
import photo from '../photos/photo.jpeg';
import photo2 from '../photos/photo2.jpeg';
import photo3 from '../photos/photo3.jpeg';
import photo4 from '../photos/photo4.jpeg';
export const weddings = {
  'demo-wedding': {
    eventDateTime: '2026-12-13T16:00:00+05:30',
    couple: {
      bride: 'Gauri',
      groom: 'Sumit',
      names: 'Sumit & Gauri',
      date: '13th December 2026',
      time: '4:00 PM',
      location: 'Muktai',
      city: 'Baramati, Pune',
      address: '[Venue Address]',
      mapUrl: 'https://www.google.com/maps',
      brideParents: 'Mrs. Sunita & Mr. Bhagwat Gore Patil',
      groomParents: 'Mrs. Ujwala & Mr. Ramhari Jagdale'
    },
    story: [
      { title: 'We met', text: 'In the quiet, ordinary way that changes everything, we found each other and discovered a home in the same conversation.' },
      { title: 'The proposal', text: 'On a golden evening, the question arrived with trembling hands and a promise that would shape the rest of our lives.' },
      { title: 'The celebration', text: 'We are gathering our favorite people to share a day of laughter, candlelight, and the joy of beginning again together.' }
    ],
    schedule: [
      { time: '3:30 PM', title: 'Ceremony' },
      { time: '5:00 PM', title: 'Cocktail Hour' },
      { time: '6:30 PM', title: 'Reception' }
    ],
    gallery: [
      photo,
      photo,
      photo2,
      photo3,
      photo4,
      // photo3
    ]
  },
  'rahul-priya': {
    eventDateTime: '2027-01-12T17:00:00+05:30',
    couple: {
      bride: 'Priya',
      groom: 'Rahul',
      names: 'Rahul & Priya',
      date: '12th January 2027',
      time: '5:00 PM',
      location: 'The Fern Residency',
      city: 'Pune, Maharashtra',
      address: 'Baner Road, Pune, Maharashtra',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Fern+Residency+Pune',
      brideParents: 'Meena & Suresh Sharma',
      groomParents: 'Kavita & Anil Mehta'
    },
    story: [
      { title: 'A shared beginning', text: 'A chance introduction became long conversations, easy laughter, and a friendship neither of us wanted to end.' },
      { title: 'A promise', text: 'With both families cheering us on, we chose a future full of warmth, adventure, and everyday joy.' },
      { title: 'Our celebration', text: 'We cannot wait to gather with the people we love and begin this new chapter together.' }
    ],
    schedule: [
      { time: '4:30 PM', title: 'Guests Arrive' },
      { time: '5:00 PM', title: 'Ceremony' },
      { time: '7:00 PM', title: 'Dinner & Celebration' }
    ],
    gallery: [
      'https://placehold.co/800x1000?text=Rahul+%26+Priya+1',
      'https://placehold.co/800x1000?text=Rahul+%26+Priya+2',
      'https://placehold.co/800x1000?text=Rahul+%26+Priya+3',
      'https://placehold.co/800x1000?text=Rahul+%26+Priya+4',
      'https://placehold.co/800x1000?text=Rahul+%26+Priya+5',
      'https://placehold.co/800x1000?text=Rahul+%26+Priya+6'
    ]
  }
};
