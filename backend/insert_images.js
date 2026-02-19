require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inject() {
    console.log("Injecting AI Images into DB Item Catalog...");

    // Clear old items first if any, to avoid duplicates
    await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const newItems = [
        {
            name: 'Chapéu de Palha Premium',
            description: 'Proteção contra o sol do escritório.',
            rarity: 'common',
            type: 'cosmetic',
            image_url: '/items/item_straw_hat_1771543366530.png'
        },
        {
            name: 'Energético Azulado',
            description: 'Dá asas ao código (Consumível).',
            rarity: 'uncommon',
            type: 'consumable',
            image_url: '/items/item_red_bull_1771543387219.png'
        },
        {
            name: 'Espada de Energia USB',
            description: 'Drive portátil que corta bugs pela raiz.',
            rarity: 'epic',
            type: 'cosmetic',
            image_url: '/items/item_usb_sword_1771543409707.png'
        },
        {
            name: 'Auréola do Fundador',
            description: 'Sinal de autoridade suprema e código livre de bugs.',
            rarity: 'mythic',
            type: 'cosmetic',
            image_url: '/items/item_founders_halo_1771543429663.png'
        }
    ];

    const { data, error } = await supabase.from('items').insert(newItems).select();
    if (error) {
        console.error("Failed to insert:", error);
    } else {
        console.log("Successfully inserted", data?.length, "items with AAA Image URLs.");
    }
}
inject();
