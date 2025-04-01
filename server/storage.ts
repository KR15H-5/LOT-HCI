import {
  users, User, InsertUser,
  items, Item, InsertItem,
  bookings, Booking, InsertBooking,
  savedItems, SavedItem, InsertSavedItem,
  recentlyViewedItems, RecentlyViewedItem, InsertRecentlyViewedItem,
  testimonials, Testimonial, InsertTestimonial,
  certificates, Certificate, InsertCertificate,
  diyProjects, DiyProject, InsertDiyProject,
  messages, Message, InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Items
  getItems(): Promise<Item[]>;
  getItemById(id: number): Promise<Item | undefined>;
  getItemsByCategory(category: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: Partial<Item>): Promise<Item | undefined>;
  
  // Bookings
  getBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getBookingsByItemId(itemId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Saved Items
  getSavedItems(userId: number): Promise<SavedItem[]>;
  getSavedItemsWithDetails(userId: number): Promise<(SavedItem & { item: Item })[]>;
  saveItem(savedItem: InsertSavedItem): Promise<SavedItem>;
  removeSavedItem(userId: number, itemId: number): Promise<void>;
  
  // Recently Viewed Items
  getRecentlyViewedItems(userId: number): Promise<RecentlyViewedItem[]>;
  getRecentlyViewedItemsWithDetails(userId: number): Promise<(RecentlyViewedItem & { item: Item })[]>;
  addRecentlyViewedItem(recentlyViewed: InsertRecentlyViewedItem): Promise<RecentlyViewedItem>;
  
  // Testimonials
  getTestimonialsByItemId(itemId: number): Promise<(Testimonial & { user: User })[]>;
  addTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Certificates
  getCertificatesByUserId(userId: number): Promise<Certificate[]>;
  addCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // DIY Projects
  getDiyProjects(): Promise<DiyProject[]>;
  getDiyProjectById(id: number): Promise<DiyProject | undefined>;
  
  // Messages
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private items: Map<number, Item>;
  private bookings: Map<number, Booking>;
  private savedItems: Map<number, SavedItem>;
  private recentlyViewedItems: Map<number, RecentlyViewedItem>;
  private testimonials: Map<number, Testimonial>;
  private certificates: Map<number, Certificate>;
  private diyProjects: Map<number, DiyProject>;
  private messages: Map<number, Message>;
  
  private userCurrentId: number;
  private itemCurrentId: number;
  private bookingCurrentId: number;
  private savedItemCurrentId: number;
  private recentlyViewedCurrentId: number;
  private testimonialCurrentId: number;
  private certificateCurrentId: number;
  private diyProjectCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.bookings = new Map();
    this.savedItems = new Map();
    this.recentlyViewedItems = new Map();
    this.testimonials = new Map();
    this.certificates = new Map();
    this.diyProjects = new Map();
    this.messages = new Map();
    
    this.userCurrentId = 1;
    this.itemCurrentId = 1;
    this.bookingCurrentId = 1;
    this.savedItemCurrentId = 1;
    this.recentlyViewedCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.certificateCurrentId = 1;
    this.diyProjectCurrentId = 1;
    this.messageCurrentId = 1;
    
    // Initialize with some sample data for development
    this.initializeData();
  }

  private initializeData() {
    // Create sample users
    const user1: InsertUser = {
      username: "john_smith",
      password: "password123",
      fullName: "John Smith",
      occupation: "Accountant",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    };
    
    const user2: InsertUser = {
      username: "jane_doe",
      password: "password123",
      fullName: "Jane Doe",
      occupation: "Carpenter",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    };
    
    this.createUser(user1);
    this.createUser(user2);
    
    // Create sample items
    const dewaltDrill: InsertItem = {
      name: "DeWalt Power Drill",
      description: "High-performance tool",
      category: "Tools",
      image: "https://i.ebayimg.com/images/g/4o0AAOSwAO9iDvvu/s-l1200.jpg",
      additionalImages: [
        "https://images.unsplash.com/photo-1664226635992-9c7b81afcf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      ],
      specifications: {
        weight: "2.5 kg",
        dimensions: "30 × 20 × 10 cm",
        age: "2 years"
      },
      suitableTasks: ["Building", "Wood", "Masonry"],
      suitability: ["Beginners", "Professionals"],
      maxHireDuration: 7,
      maxHireQuantity: 2,
      careInstructions: "Keep dry and clean after use",
      trainingRequired: "Basic training",
      expertSupportRequired: "Must be used with staff present",
      safetyInstructions: "Wear safety goggles",
      pricePerDay: 25,
      pricePerWeek: 150,
      ownerId: 2
    };
    
    const gardenShovel: InsertItem = {
      name: "Garden Shovel",
      description: "Durable and lightweight",
      category: "Garden",
      image: "https://i.etsystatic.com/21657904/r/il/191d2b/5544106641/il_fullxfull.5544106641_stre.jpg",
      suitableTasks: ["Gardening", "Planting", "Digging"],
      suitability: ["Beginners", "Elderly"],
      maxHireDuration: 14,
      maxHireQuantity: 3,
      careInstructions: "Clean soil off after use",
      pricePerDay: 15,
      pricePerWeek: 90,
      ownerId: 2
    };
    
    const lawnMower: InsertItem = {
      name: "Lawn Mower",
      description: "Electric lawn mower",
      category: "Garden",
      image:"https://cdn.mos.cms.futurecdn.net/hUoSSQLzrxcmcFsWcwiRVe.jpg",
      suitableTasks: ["Lawn care", "Garden maintenance"],
      suitability: ["Adults"],
      maxHireDuration: 5,
      maxHireQuantity: 1,
      trainingRequired: "Training Required",
      safetyInstructions: "Keep away from children",
      pricePerDay: 35,
      pricePerWeek: 200,
      ownerId: 2
    };
    
    const drillMachine: InsertItem = {
      name: "Drill Machine",
      description: "Professional drill",
      category: "Tools",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      suitableTasks: ["Construction", "Woodworking"],
      suitability: ["Professionals"],
      maxHireDuration: 10,
      maxHireQuantity: 2,
      expertSupportRequired: "Expert Support",
      pricePerDay: 30,
      pricePerWeek: 175,
      ownerId: 2
    };
    
    const leafBlower: InsertItem = {
      name: "Leaf Blower",
      description: "Powerful leaf blower",
      category: "Garden",
      image: "https://www.therange.co.uk/media/6/8/1734617230_11_1302.jpg",
      suitableTasks: ["Clearing leaves", "Garden cleanup"],
      suitability: ["Adults"],
      maxHireDuration: 5,
      maxHireQuantity: 1,
      expertSupportRequired: "Expert Support",
      pricePerDay: 25,
      pricePerWeek: 140,
      ownerId: 2
    };
    
    const hammerDrill: InsertItem = {
      name: "Hammer Drill",
      description: "Heavy-duty hammer drill",
      category: "Tools",
      image: "https://www.lawson-his.co.uk/media/catalog/product/cache/1/image/1200x/040ec09b1e35df139433887a97daa66f/h/r/xhr2631ft_5_1.jpg.pagespeed.ic.gEoPX664qx.jpg",
      suitableTasks: ["Masonry", "Concrete work"],
      suitability: ["Professionals"],
      maxHireDuration: 7,
      maxHireQuantity: 1,
      pricePerDay: 40,
      pricePerWeek: 220,
      ownerId: 2
    };
    
    this.createItem(dewaltDrill);
    this.createItem(gardenShovel);
    this.createItem(lawnMower);
    this.createItem(drillMachine);
    this.createItem(leafBlower);
    this.createItem(hammerDrill);
    
    // Create DIY Projects

    const diyProject2: InsertDiyProject = {
      title: "Raised bed",
      description: "Create your own garden raised bed",
      image: "https://static1.squarespace.com/static/5811566d20099e23814644fd/t/63406fedf2a008202cef28f9/1665167341384/DAMMAN~2.JPG?format=1500w",
      duration: "1 hr project",
      difficulty: "Easy",
      toolsRequired: ["Garden Shovel", "Drill", "Measuring Tape"],
      type: "project"
    };
    const diyProject1: InsertDiyProject = {
      title: "Build a wooden shoppiece",
      description: "Learn how to build a beautiful wooden shoppiece for your home",
      image: "../..//attached_assets/dewalt-drill.jpg",
      duration: "30 min step guide",
      difficulty: "Medium",
      toolsRequired: ["Hammer", "Saw", "Screwdriver", "Drill"],
      type: "step guide"
    };
    
    
    
    const diyProject3: InsertDiyProject = {
      title: "Tic-tac-toe board",
      description: "Fun family project to create a wooden game",
      image: "https://i.etsystatic.com/12707575/r/il/f9ddd1/3037721964/il_fullxfull.3037721964_hcum.jpg",
      duration: "1 hr project",
      difficulty: "Easy",
      toolsRequired: ["Saw", "Sandpaper", "Paint Brush"],
      type: "project"
    };
    
    // Add more DIY projects
    const diyProject4: InsertDiyProject = {
      title: "Herb planter",
      description: "Create a beautiful indoor herb planter for your kitchen",
      image: "https://www.knowlenets.co.uk/cdn/shop/products/HerbWallplantersun-WEB-KN.jpg?v=1635328547",
      duration: "45 min project",
      difficulty: "Easy",
      toolsRequired: ["Drill", "Hand Saw", "Hammer"],
      type: "project"
    };
    
    const diyProject5: InsertDiyProject = {
      title: "Custom kitchen shelf",
      description: "Build a floating kitchen shelf for spices and utensils",
      image: "https://www.castinstyle.co.uk/image/cache/catalog/images/products/normal/6-Lath-Kitchen-Shelf-Rack-550x550.jpg",
      duration: "2 hr project",
      difficulty: "Medium",
      toolsRequired: ["Hammer Drill", "Level", "Screwdriver", "Tape Measure"],
      type: "project"
    };
    
    const diyProject6: InsertDiyProject = {
      title: "Backyard fire pit",
      description: "Build a durable and safe fire pit for your backyard",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8YJFqbhR9VUTgSrb_uQ1uYKs8VhZVTjtRzQ&s",
      duration: "3 hr project",
      difficulty: "Hard",
      toolsRequired: ["Shovel", "Rake", "Wheelbarrow", "Level", "Tape Measure"],
      type: "project"
    };
    
    this.addDiyProject(diyProject1);
    this.addDiyProject(diyProject2);
    this.addDiyProject(diyProject3);
    this.addDiyProject(diyProject4);
    this.addDiyProject(diyProject5);
    this.addDiyProject(diyProject6);
    
    // Create sample testimonials
    const testimonial1: InsertTestimonial = {
      itemId: 1,
      userId: 1,
      rating: 5,
      comment: "Perfect for my DIY project! The drill was in excellent condition and performed wonderfully."
    };
    
    const testimonial2: InsertTestimonial = {
      itemId: 1,
      userId: 2,
      rating: 4,
      comment: "Great tool, but I wish they provided more detailed usage instructions. Staff was very helpful though!"
    };
    
    this.addTestimonial(testimonial1);
    this.addTestimonial(testimonial2);
    
    // Create user certificates
    const certificate1: InsertCertificate = {
      userId: 1,
      name: "Safety Training"
    };
    
    const certificate2: InsertCertificate = {
      userId: 1,
      name: "Tool Handling"
    };
    
    const certificate3: InsertCertificate = {
      userId: 1,
      name: "First Aid"
    };
    
    this.addCertificate(certificate1);
    this.addCertificate(certificate2);
    this.addCertificate(certificate3);
    
    // Create sample bookings
    const booking1: InsertBooking = {
      itemId: 3, // Lawn Mower
      userId: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: "active",
      totalPrice: 105,
      location: "Lenton"
    };
    
    const booking2: InsertBooking = {
      itemId: 4, // Drill Machine
      userId: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: "returning",
      totalPrice: 60,
      location: "Lenton"
    };
    
    this.createBooking(booking1);
    this.createBooking(booking2);
    
    // Create sample saved items
    const savedItem1: InsertSavedItem = {
      itemId: 1, // DeWalt Power Drill
      userId: 1
    };
    
    const savedItem2: InsertSavedItem = {
      itemId: 2, // Garden Shovel
      userId: 1
    };
    
    this.saveItem(savedItem1);
    this.saveItem(savedItem2);
    
    // Create sample recently viewed items
    this.addRecentlyViewedItem({ itemId: 3, userId: 1 }); // Lawn Mower
    this.addRecentlyViewedItem({ itemId: 4, userId: 1 }); // Drill Machine
    this.addRecentlyViewedItem({ itemId: 5, userId: 1 }); // Leaf Blower
    this.addRecentlyViewedItem({ itemId: 6, userId: 1 }); // Hammer Drill
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    // Ensure all optional fields are explicitly set to null if undefined
    const newUser: User = { 
      id, 
      createdAt,
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      occupation: user.occupation ?? null,
      profileImage: user.profileImage ?? null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  // Item methods
  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItemById(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      (item) => item.category === category
    );
  }

  async createItem(item: InsertItem): Promise<Item> {
    const id = this.itemCurrentId++;
    const createdAt = new Date();
    // Ensure all required fields are defined properly
    const newItem: Item = { 
      id,
      createdAt,
      name: item.name,
      description: item.description,
      category: item.category,
      image: item.image,
      ownerId: item.ownerId,
      pricePerDay: item.pricePerDay,
      rating: item.rating ?? null,
      specifications: item.specifications ?? null,
      additionalImages: item.additionalImages ?? null,
      pricePerWeek: item.pricePerWeek ?? null,
      suitableTasks: item.suitableTasks ?? null,
      suitability: item.suitability ?? null,
      expertSupportRequired: item.expertSupportRequired ?? null,
      maxHireDuration: item.maxHireDuration ?? null,
      maxHireQuantity: item.maxHireQuantity ?? null,
      hireDurationUnit: item.hireDurationUnit ?? null,
      isAvailable: item.isAvailable ?? true,
      available: item.available ?? null
    };
    this.items.set(id, newItem);
    return newItem;
  }

  async updateItem(id: number, itemUpdate: Partial<Item>): Promise<Item | undefined> {
    const item = await this.getItemById(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemUpdate };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getBookingsByItemId(itemId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.itemId === itemId
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const createdAt = new Date();
    // Ensure all fields meet the type requirements
    const newBooking: Booking = { 
      id, 
      createdAt,
      itemId: booking.itemId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
      totalPrice: booking.totalPrice,
      location: booking.location ?? null
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = await this.getBookingById(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Saved Items methods
  async getSavedItems(userId: number): Promise<SavedItem[]> {
    return Array.from(this.savedItems.values()).filter(
      (savedItem) => savedItem.userId === userId
    );
  }

  async getSavedItemsWithDetails(userId: number): Promise<(SavedItem & { item: Item })[]> {
    const savedItems = await this.getSavedItems(userId);
    return Promise.all(
      savedItems.map(async (savedItem) => {
        const item = await this.getItemById(savedItem.itemId);
        return { ...savedItem, item: item! };
      })
    );
  }

  async saveItem(savedItem: InsertSavedItem): Promise<SavedItem> {
    const id = this.savedItemCurrentId++;
    const savedAt = new Date();
    const newSavedItem: SavedItem = { id, ...savedItem, savedAt };
    this.savedItems.set(id, newSavedItem);
    return newSavedItem;
  }

  async removeSavedItem(userId: number, itemId: number): Promise<void> {
    const savedItems = await this.getSavedItems(userId);
    const savedItem = savedItems.find(item => item.itemId === itemId);
    
    if (savedItem) {
      this.savedItems.delete(savedItem.id);
    }
  }

  // Recently Viewed Items methods
  async getRecentlyViewedItems(userId: number): Promise<RecentlyViewedItem[]> {
    return Array.from(this.recentlyViewedItems.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
      .slice(0, 10);
  }

  async getRecentlyViewedItemsWithDetails(userId: number): Promise<(RecentlyViewedItem & { item: Item })[]> {
    const recentItems = await this.getRecentlyViewedItems(userId);
    return Promise.all(
      recentItems.map(async (recentItem) => {
        const item = await this.getItemById(recentItem.itemId);
        return { ...recentItem, item: item! };
      })
    );
  }

  async addRecentlyViewedItem(recentlyViewed: InsertRecentlyViewedItem): Promise<RecentlyViewedItem> {
    // Check if item was already viewed by this user
    const existingItems = await this.getRecentlyViewedItems(recentlyViewed.userId);
    const existingItem = existingItems.find(item => item.itemId === recentlyViewed.itemId);
    
    if (existingItem) {
      // Update timestamp
      const updatedItem = { ...existingItem, viewedAt: new Date() };
      this.recentlyViewedItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      const id = this.recentlyViewedCurrentId++;
      const viewedAt = new Date();
      const newRecentlyViewed: RecentlyViewedItem = { id, ...recentlyViewed, viewedAt };
      this.recentlyViewedItems.set(id, newRecentlyViewed);
      return newRecentlyViewed;
    }
  }

  // Testimonials methods
  async getTestimonialsByItemId(itemId: number): Promise<(Testimonial & { user: User })[]> {
    const testimonials = Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.itemId === itemId
    );
    
    return Promise.all(
      testimonials.map(async (testimonial) => {
        const user = await this.getUser(testimonial.userId);
        return { ...testimonial, user: user! };
      })
    );
  }

  async addTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const createdAt = new Date();
    const newTestimonial: Testimonial = { id, ...testimonial, createdAt };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  // Certificates methods
  async getCertificatesByUserId(userId: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(
      (certificate) => certificate.userId === userId
    );
  }

  async addCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateCurrentId++;
    const issuedAt = new Date();
    const newCertificate: Certificate = { id, ...certificate, issuedAt };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }

  // DIY Projects methods
  async getDiyProjects(): Promise<DiyProject[]> {
    return Array.from(this.diyProjects.values());
  }

  async getDiyProjectById(id: number): Promise<DiyProject | undefined> {
    return this.diyProjects.get(id);
  }

  private async addDiyProject(project: InsertDiyProject): Promise<DiyProject> {
    const id = this.diyProjectCurrentId++;
    const createdAt = new Date();
    const newProject: DiyProject = { 
      id,
      createdAt,
      title: project.title,
      image: project.image,
      type: project.type,
      description: project.description,
      duration: project.duration,
      difficulty: project.difficulty ?? null,
      toolsRequired: project.toolsRequired ?? null
    };
    this.diyProjects.set(id, newProject);
    return newProject;
  }

  // Messages methods
  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(
        (message) => 
          (message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const sentAt = new Date();
    const newMessage: Message = { id, ...message, sentAt, isRead: false };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    const messages = Array.from(this.messages.values())
      .filter(message => message.senderId === senderId && message.receiverId === receiverId && !message.isRead);
    
    messages.forEach(message => {
      const updatedMessage = { ...message, isRead: true };
      this.messages.set(message.id, updatedMessage);
    });
  }
}

export const storage = new MemStorage();
