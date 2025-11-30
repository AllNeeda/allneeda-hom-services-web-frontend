
export interface Service {
    badge: string;
    image: string;
    favorite: boolean;
    title: string;
    subtitle: string;
    address: string;
    distance: string | null;
    rating: number;
    reviews: number;
    oldPrice: string;
    newPrice: string;
    discount: string;
    ratingColor: string;
    priceColor: string;
    discountColor: string;
    promo: {
        price: string;
        code: string;
    } | null;
    promoColor?: string;
  }
