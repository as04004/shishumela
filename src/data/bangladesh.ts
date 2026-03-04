export interface Division {
  id: string;
  name: string;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
}

export const divisions: Division[] = [
  { id: '1', name: 'Dhaka' },
  { id: '2', name: 'Chattogram' },
  { id: '3', name: 'Rajshahi' },
  { id: '4', name: 'Khulna' },
  { id: '5', name: 'Barishal' },
  { id: '6', name: 'Sylhet' },
  { id: '7', name: 'Rangpur' },
  { id: '8', name: 'Mymensingh' }
];

export const districts: District[] = [
  // Dhaka Division
  { id: '101', divisionId: '1', name: 'Dhaka' },
  { id: '102', divisionId: '1', name: 'Gazipur' },
  { id: '103', divisionId: '1', name: 'Narayanganj' },
  { id: '104', divisionId: '1', name: 'Tangail' },
  { id: '105', divisionId: '1', name: 'Faridpur' },
  { id: '106', divisionId: '1', name: 'Manikganj' },
  { id: '107', divisionId: '1', name: 'Munshiganj' },
  { id: '108', divisionId: '1', name: 'Narsingdi' },
  { id: '109', divisionId: '1', name: 'Rajbari' },
  { id: '110', divisionId: '1', name: 'Shariatpur' },
  { id: '111', divisionId: '1', name: 'Gopalganj' },
  { id: '112', divisionId: '1', name: 'Madaripur' },
  { id: '113', divisionId: '1', name: 'Kishoreganj' },

  // Chattogram Division
  { id: '201', divisionId: '2', name: 'Chattogram' },
  { id: '202', divisionId: '2', name: 'Cox\'s Bazar' },
  { id: '203', divisionId: '2', name: 'Cumilla' },
  { id: '204', divisionId: '2', name: 'Feni' },
  { id: '205', divisionId: '2', name: 'Brahmanbaria' },
  { id: '206', divisionId: '2', name: 'Noakhali' },
  { id: '207', divisionId: '2', name: 'Lakshmipur' },
  { id: '208', divisionId: '2', name: 'Chandpur' },
  { id: '209', divisionId: '2', name: 'Khagrachhari' },
  { id: '210', divisionId: '2', name: 'Rangamati' },
  { id: '211', divisionId: '2', name: 'Bandarban' },

  // Rajshahi Division
  { id: '301', divisionId: '3', name: 'Rajshahi' },
  { id: '302', divisionId: '3', name: 'Bogura' },
  { id: '303', divisionId: '3', name: 'Pabna' },
  { id: '304', divisionId: '3', name: 'Sirajganj' },
  { id: '305', divisionId: '3', name: 'Naogaon' },
  { id: '306', divisionId: '3', name: 'Natore' },
  { id: '307', divisionId: '3', name: 'Joypurhat' },
  { id: '308', divisionId: '3', name: 'Chapai Nawabganj' },

  // Khulna Division
  { id: '401', divisionId: '4', name: 'Khulna' },
  { id: '402', divisionId: '4', name: 'Jashore' },
  { id: '403', divisionId: '4', name: 'Satkhira' },
  { id: '404', divisionId: '4', name: 'Bagerhat' },
  { id: '405', divisionId: '4', name: 'Kushtia' },
  { id: '406', divisionId: '4', name: 'Jhenaidah' },
  { id: '407', divisionId: '4', name: 'Magura' },
  { id: '408', divisionId: '4', name: 'Meherpur' },
  { id: '409', divisionId: '4', name: 'Narail' },
  { id: '410', divisionId: '4', name: 'Chuadanga' },

  // Barishal Division
  { id: '501', divisionId: '5', name: 'Barishal' },
  { id: '502', divisionId: '5', name: 'Bhola' },
  { id: '503', divisionId: '5', name: 'Patuakhali' },
  { id: '504', divisionId: '5', name: 'Pirojpur' },
  { id: '505', divisionId: '5', name: 'Jhalokati' },
  { id: '506', divisionId: '5', name: 'Barguna' },

  // Sylhet Division
  { id: '601', divisionId: '6', name: 'Sylhet' },
  { id: '602', divisionId: '6', name: 'Moulvibazar' },
  { id: '603', divisionId: '6', name: 'Habiganj' },
  { id: '604', divisionId: '6', name: 'Sunamganj' },

  // Rangpur Division
  { id: '701', divisionId: '7', name: 'Rangpur' },
  { id: '702', divisionId: '7', name: 'Dinajpur' },
  { id: '703', divisionId: '7', name: 'Kurigram' },
  { id: '704', divisionId: '7', name: 'Gaibandha' },
  { id: '705', divisionId: '7', name: 'Nilphamari' },
  { id: '706', divisionId: '7', name: 'Panchagarh' },
  { id: '707', divisionId: '7', name: 'Thakurgaon' },
  { id: '708', divisionId: '7', name: 'Lalmonirhat' },

  // Mymensingh Division
  { id: '801', divisionId: '8', name: 'Mymensingh' },
  { id: '802', divisionId: '8', name: 'Jamalpur' },
  { id: '803', divisionId: '8', name: 'Netrokona' },
  { id: '804', divisionId: '8', name: 'Sherpur' }
];

export const upazilas: Record<string, string[]> = {
  '101': ['Dhanmondi', 'Gulshan', 'Uttara', 'Mirpur', 'Mohammadpur', 'Badda', 'Savar', 'Keraniganj', 'Dhamrai', 'Nawabganj', 'Dohar', 'Demra', 'Hazaribagh', 'Jatrabari', 'Kadamtali', 'Kalabagan', 'Kamrangirchar', 'Khilgaon', 'Khilkhet', 'Kotwali', 'Lalbagh', 'Motijheel', 'New Market', 'Pallabi', 'Paltan', 'Ramna', 'Rampura', 'Sabujbagh', 'Shah Ali', 'Shahbagh', 'Sher-e-Bangla Nagar', 'Shyampur', 'Sutrapur', 'Tejgaon', 'Turag', 'Uttar Khan', 'Vatara', 'Wari'],
  '102': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
  '103': ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
  '104': ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur'],
  '105': ['Faridpur Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
  '112': ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar'],
  '201': ['Chattogram Sadar', 'Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
  '203': ['Cumilla Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Monohargonj', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
  '301': ['Rajshahi Sadar', 'Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'],
  '302': ['Bogura Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatola'],
  '401': ['Khulna Sadar', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsha', 'Terokhada'],
  '402': ['Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
  '501': ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
  '601': ['Sylhet Sadar', 'Balaganj', 'Beanibazar', 'Bishwanath', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'South Surma', 'Zakiganj'],
  '701': ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
  '801': ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal']
};

// Default upazilas for districts not explicitly listed above
export const getDefaultUpazilas = (districtName: string) => {
  return [districtName + ' Sadar', 'Upazila 1', 'Upazila 2'];
};
