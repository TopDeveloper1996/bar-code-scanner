from dataclasses import dataclass
from typing import Optional

@dataclass
class Item:
    barcode: str
    name: str
    brand: str
    stock: int
    id: Optional[int] = None
    
    def to_dict(self):
        return {
            'id': self.id,
            'barcode': self.barcode,
            'name': self.name,
            'brand': self.brand,
            'stock': self.stock
        }