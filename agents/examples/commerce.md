# UIify examples: commerce

id|job|parts|tags|path
product-card|image, name, stock, sale price, add to cart|Card,AspectRatio,Badge|product,sale|commerce/product-card.tsx
cart-summary|cart lines with remove, subtotal|Card,Item,Separator|cart|commerce/cart-summary.tsx
order-summary|subtotal, shipping, tax and total rows|Card,Badge,Table|checkout,totals|commerce/order-summary.tsx
checkout|email, delivery choice, card, total|Card,Field,Input,RadioGroup|checkout,payment|commerce/checkout.tsx
shipping-options|radio cards with price per method|Card,RadioGroup,Field,Badge|shipping,choice|commerce/shipping-options.tsx
