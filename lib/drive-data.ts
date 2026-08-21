export interface UserAvatar {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface QuickAccessFolder {
  id: string;
  title: string;
  sharedWith: UserAvatar[];
  type: "folder" | "file";
  isPrimaryActive?: boolean;
  itemCount?: number;
  lastModified?: string;
  fileType?: "doc" | "sheet" | "pdf" | "image" | "slide";
}

export interface DriveFileItem {
  id: string;
  name: string;
  fileType: "doc" | "sheet" | "pdf" | "word" | "image" | "slide" | "zip";
  owners: UserAvatar[];
  lastModified: string;
  fileSize: string;
  sizeInBytes: number;
  category: "my-drive" | "shared" | "recents" | "trash" | "starred" | "backups";
  starred?: boolean;
  folderId?: string;
  previewUrl?: string;
  description?: string;
}

export const CURRENT_USER: UserAvatar = {
  id: "user-jessica",
  name: "Jessica",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
};

export const MOCK_USERS: Record<string, UserAvatar> = {
  jessica: {
    id: "user-1",
    name: "Jessica Miller",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  },
  sarah: {
    id: "user-2",
    name: "Sarah Jenkins",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80",
  },
  alex: {
    id: "user-3",
    name: "Alex Johnson",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  maria: {
    id: "user-4",
    name: "Maria Santos",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  david: {
    id: "user-5",
    name: "David Kim",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
  emily: {
    id: "user-6",
    name: "Emily Watson",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
  },
};

export const INITIAL_QUICK_ACCESS: QuickAccessFolder[] = [
  {
    id: "folder-design-files",
    title: "Design Files",
    type: "folder",
    isPrimaryActive: true,
    itemCount: 48,
    sharedWith: [MOCK_USERS.sarah, MOCK_USERS.jessica, MOCK_USERS.alex, MOCK_USERS.maria],
  },
  {
    id: "folder-google-photos",
    title: "Google Photos",
    type: "folder",
    itemCount: 1420,
    sharedWith: [MOCK_USERS.sarah, MOCK_USERS.alex, MOCK_USERS.david],
  },
  {
    id: "folder-training-materials",
    title: "Training Materials",
    type: "folder",
    itemCount: 16,
    sharedWith: [MOCK_USERS.sarah, MOCK_USERS.alex, MOCK_USERS.david, MOCK_USERS.emily],
  },
  {
    id: "file-english-summary",
    title: "Project Summary For English Class",
    type: "file",
    fileType: "doc",
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    sharedWith: [MOCK_USERS.david],
  },
];

export const INITIAL_FILES: DriveFileItem[] = [
  {
    id: "file-1",
    name: "Weekly Report Docs",
    fileType: "doc",
    owners: [MOCK_USERS.sarah, MOCK_USERS.jessica],
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    fileSize: "20 MB",
    sizeInBytes: 20971520,
    category: "my-drive",
    starred: true,
    description: "Weekly executive briefing document outlining sprint progress and delivery goals.",
  },
  {
    id: "file-2",
    name: "Design Checklist.xlsx",
    fileType: "sheet",
    owners: [MOCK_USERS.sarah],
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    fileSize: "20 MB",
    sizeInBytes: 20971520,
    category: "my-drive",
    starred: false,
    description: "QA design audit spreadsheet with visual acceptance criteria.",
  },
  {
    id: "file-3",
    name: "Weekly reports.pdf",
    fileType: "pdf",
    owners: [MOCK_USERS.sarah],
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    fileSize: "20 MB",
    sizeInBytes: 20971520,
    category: "my-drive",
    starred: false,
    description: "Compiled export of quarterly performance reviews and charts.",
  },
  {
    id: "file-4",
    name: "Wedding Planner List.Doc",
    fileType: "word",
    owners: [MOCK_USERS.sarah],
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    fileSize: "20 MB",
    sizeInBytes: 20971520,
    category: "my-drive",
    starred: true,
    description: "Vendor contacts, seating chart layout, and schedule.",
  },
  {
    id: "file-5",
    name: "Team JB Picture.jpg",
    fileType: "image",
    owners: [MOCK_USERS.sarah],
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    fileSize: "20 MB",
    sizeInBytes: 20971520,
    category: "my-drive",
    starred: false,
    previewUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    description: "High resolution team retreat group photo.",
  },
  {
    id: "file-6",
    name: "Team Bert Picture.jpg",
    fileType: "image",
    owners: [MOCK_USERS.sarah],
    lastModified: "Sep 9 ,2019 - 4:30 AM",
    fileSize: "20 MB",
    sizeInBytes: 20971520,
    category: "my-drive",
    starred: false,
    previewUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80",
    description: "Team brainstorming workshop snapshot.",
  },
];
