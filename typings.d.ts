export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  comments: Comment[];
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
}

export interface Comment {
  _id: string;
  _type: string;
  userName: string;
  email: string;
  comment: string;
  post: {
    _type: string;
    _ref: string;
  };
  approved: boolean;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}
