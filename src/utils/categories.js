// =====================================================
// SISTEMA COMPLETO DE CATEGORÍAS Y SUBCATEGORÍAS
// Archivo: src/utils/categories.js
// =====================================================

export const CATEGORIES = [
  {
    id: 'ropa',
    name: 'Ropa',
    icon: '👕',
    color: '#E91E63',
    subcategories: [
      {
        id: 'ropa_hombre',
        name: 'Hombre',
        icon: '👔',
        items: [
          { id: 'remera_h', name: 'Remeras' },
          { id: 'pantalon_h', name: 'Pantalones' },
          { id: 'campera_h', name: 'Camperas' },
          { id: 'camisa_h', name: 'Camisas' },
          { id: 'short_h', name: 'Shorts' },
          { id: 'traje_h', name: 'Trajes' },
          { id: 'ropa_interior_h', name: 'Ropa interior' },
          { id: 'pijama_h', name: 'Pijamas' }
        ]
      },
      {
        id: 'ropa_mujer',
        name: 'Mujer',
        icon: '👗',
        items: [
          { id: 'remera_m', name: 'Remeras' },
          { id: 'pantalon_m', name: 'Pantalones' },
          { id: 'vestido', name: 'Vestidos' },
          { id: 'falda', name: 'Faldas' },
          { id: 'campera_m', name: 'Camperas' },
          { id: 'blusa', name: 'Blusas' },
          { id: 'ropa_interior_m', name: 'Ropa interior' },
          { id: 'pijama_m', name: 'Pijamas' }
        ]
      },
      {
        id: 'ropa_ninos',
        name: 'Niños',
        icon: '👶',
        items: [
          { id: 'bebe', name: 'Bebé (0-2 años)' },
          { id: 'nino_pequeno', name: 'Niño pequeño (2-6)' },
          { id: 'nino_grande', name: 'Niño (6-12)' },
          { id: 'adolescente', name: 'Adolescente' }
        ]
      },
      {
        id: 'ropa_temporada',
        name: 'Por temporada',
        icon: '🌡️',
        items: [
          { id: 'verano', name: 'Verano' },
          { id: 'invierno', name: 'Invierno' },
          { id: 'entretiempo', name: 'Entretiempo' }
        ]
      },
      {
        id: 'calzado',
        name: 'Calzado',
        icon: '👟',
        items: [
          { id: 'zapatillas', name: 'Zapatillas' },
          { id: 'zapatos', name: 'Zapatos' },
          { id: 'sandalias', name: 'Sandalias' },
          { id: 'botas', name: 'Botas' },
          { id: 'ojotas', name: 'Ojotas' }
        ]
      },
      {
        id: 'accesorios_ropa',
        name: 'Accesorios',
        icon: '🧢',
        items: [
          { id: 'gorras', name: 'Gorras/Sombreros' },
          { id: 'bufandas', name: 'Bufandas' },
          { id: 'cinturones', name: 'Cinturones' },
          { id: 'carteras', name: 'Carteras/Bolsos' },
          { id: 'relojes', name: 'Relojes' },
          { id: 'anteojos', name: 'Anteojos' }
        ]
      }
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    shoesSizes: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
  },
  
  {
    id: 'tecnologia',
    name: 'Tecnología',
    icon: '💻',
    color: '#2196F3',
    subcategories: [
      {
        id: 'computadoras',
        name: 'Computadoras',
        icon: '🖥️',
        items: [
          { id: 'pc_escritorio', name: 'PC de escritorio' },
          { id: 'laptop', name: 'Laptop/Notebook' },
          { id: 'all_in_one', name: 'All in One' },
          { id: 'mac', name: 'Mac/iMac' }
        ]
      },
      {
        id: 'celulares',
        name: 'Celulares',
        icon: '📱',
        items: [
          { id: 'smartphone', name: 'Smartphone' },
          { id: 'iphone', name: 'iPhone' },
          { id: 'samsung', name: 'Samsung' },
          { id: 'xiaomi', name: 'Xiaomi' },
          { id: 'motorola', name: 'Motorola' },
          { id: 'otro_celular', name: 'Otras marcas' }
        ]
      },
      {
        id: 'tablets',
        name: 'Tablets',
        icon: '📲',
        items: [
          { id: 'ipad', name: 'iPad' },
          { id: 'tablet_android', name: 'Android' },
          { id: 'kindle', name: 'Kindle/E-reader' }
        ]
      },
      {
        id: 'perifericos',
        name: 'Periféricos',
        icon: '🖱️',
        items: [
          { id: 'monitor', name: 'Monitores' },
          { id: 'teclado', name: 'Teclados' },
          { id: 'mouse', name: 'Mouse' },
          { id: 'webcam', name: 'Webcam' },
          { id: 'auriculares', name: 'Auriculares' },
          { id: 'parlantes', name: 'Parlantes' },
          { id: 'microfono', name: 'Micrófonos' }
        ]
      },
      {
        id: 'impresion',
        name: 'Impresión',
        icon: '🖨️',
        items: [
          { id: 'impresora', name: 'Impresoras' },
          { id: 'scanner', name: 'Scanners' },
          { id: 'multifuncion', name: 'Multifunción' }
        ]
      },
      {
        id: 'componentes',
        name: 'Componentes',
        icon: '🔧',
        items: [
          { id: 'placa_video', name: 'Placa de video' },
          { id: 'procesador', name: 'Procesador' },
          { id: 'memoria_ram', name: 'Memoria RAM' },
          { id: 'disco_duro', name: 'Disco duro/SSD' },
          { id: 'fuente', name: 'Fuente de poder' },
          { id: 'gabinete', name: 'Gabinete' },
          { id: 'mother', name: 'Motherboard' }
        ]
      },
      {
        id: 'gaming',
        name: 'Gaming',
        icon: '🎮',
        items: [
          { id: 'consola', name: 'Consolas' },
          { id: 'joystick', name: 'Joysticks/Controles' },
          { id: 'videojuegos', name: 'Videojuegos' },
          { id: 'silla_gamer', name: 'Sillas gamer' },
          { id: 'accesorios_gaming', name: 'Accesorios gaming' }
        ]
      },
      {
        id: 'fotografia',
        name: 'Fotografía',
        icon: '📷',
        items: [
          { id: 'camara_foto', name: 'Cámaras' },
          { id: 'lentes', name: 'Lentes/Objetivos' },
          { id: 'tripode', name: 'Trípodes' },
          { id: 'flash', name: 'Flash' },
          { id: 'drone', name: 'Drones' }
        ]
      },
      {
        id: 'smart_home',
        name: 'Smart Home',
        icon: '🏠',
        items: [
          { id: 'smart_tv', name: 'Smart TV' },
          { id: 'chromecast', name: 'Chromecast/Streaming' },
          { id: 'smart_speaker', name: 'Parlantes inteligentes' },
          { id: 'camaras_seguridad', name: 'Cámaras de seguridad' }
        ]
      }
    ]
  },
  
  {
    id: 'hogar',
    name: 'Hogar',
    icon: '🏠',
    color: '#4CAF50',
    subcategories: [
      {
        id: 'cocina',
        name: 'Cocina',
        icon: '🍳',
        items: [
          { id: 'ollas', name: 'Ollas/Cacerolas' },
          { id: 'sartenes', name: 'Sartenes' },
          { id: 'cubiertos', name: 'Cubiertos' },
          { id: 'platos', name: 'Platos' },
          { id: 'vasos', name: 'Vasos/Copas' },
          { id: 'tazas', name: 'Tazas' },
          { id: 'electrodomesticos_cocina', name: 'Electrodomésticos' },
          { id: 'utensilios', name: 'Utensilios' }
        ]
      },
      {
        id: 'living',
        name: 'Living/Sala',
        icon: '🛋️',
        items: [
          { id: 'sofa', name: 'Sofás/Sillones' },
          { id: 'mesa_ratona', name: 'Mesa ratona' },
          { id: 'estantes', name: 'Estantes/Bibliotecas' },
          { id: 'tv_mueble', name: 'Mueble TV' },
          { id: 'alfombras', name: 'Alfombras' },
          { id: 'cortinas', name: 'Cortinas' },
          { id: 'cuadros', name: 'Cuadros/Decoración' }
        ]
      },
      {
        id: 'dormitorio',
        name: 'Dormitorio',
        icon: '🛏️',
        items: [
          { id: 'cama', name: 'Camas' },
          { id: 'colchon', name: 'Colchones' },
          { id: 'almohadas', name: 'Almohadas' },
          { id: 'sabanas', name: 'Sábanas/Acolchados' },
          { id: 'placard', name: 'Placard/Ropero' },
          { id: 'mesita_luz', name: 'Mesita de luz' },
          { id: 'comoda', name: 'Cómoda' }
        ]
      },
      {
        id: 'bano',
        name: 'Baño',
        icon: '🚿',
        items: [
          { id: 'toallas', name: 'Toallas' },
          { id: 'cortina_bano', name: 'Cortina de baño' },
          { id: 'organizadores_bano', name: 'Organizadores' },
          { id: 'accesorios_bano', name: 'Accesorios' }
        ]
      },
      {
        id: 'comedor',
        name: 'Comedor',
        icon: '🪑',
        items: [
          { id: 'mesa_comedor', name: 'Mesas' },
          { id: 'sillas', name: 'Sillas' },
          { id: 'aparador', name: 'Aparador/Modular' },
          { id: 'manteleria', name: 'Mantelería' }
        ]
      },
      {
        id: 'jardin',
        name: 'Jardín/Exterior',
        icon: '🌳',
        items: [
          { id: 'muebles_jardin', name: 'Muebles de jardín' },
          { id: 'parrilla', name: 'Parrillas/BBQ' },
          { id: 'plantas', name: 'Plantas' },
          { id: 'macetas', name: 'Macetas' },
          { id: 'herramientas_jardin', name: 'Herramientas' }
        ]
      },
      {
        id: 'electrodomesticos',
        name: 'Electrodomésticos',
        icon: '🔌',
        items: [
          { id: 'heladera', name: 'Heladera' },
          { id: 'lavarropas', name: 'Lavarropas' },
          { id: 'microondas', name: 'Microondas' },
          { id: 'aire_acondicionado', name: 'Aire acondicionado' },
          { id: 'ventilador', name: 'Ventiladores' },
          { id: 'aspiradora', name: 'Aspiradoras' },
          { id: 'plancha', name: 'Planchas' }
        ]
      },
      {
        id: 'iluminacion',
        name: 'Iluminación',
        icon: '💡',
        items: [
          { id: 'lamparas', name: 'Lámparas' },
          { id: 'veladores', name: 'Veladores' },
          { id: 'apliques', name: 'Apliques' },
          { id: 'luces_led', name: 'Luces LED' }
        ]
      }
    ]
  },
  
  {
    id: 'libros',
    name: 'Libros',
    icon: '📚',
    color: '#9C27B0',
    subcategories: [
      {
        id: 'ficcion',
        name: 'Ficción',
        icon: '📖',
        items: [
          { id: 'novela', name: 'Novelas' },
          { id: 'ciencia_ficcion', name: 'Ciencia ficción' },
          { id: 'fantasia', name: 'Fantasía' },
          { id: 'romance', name: 'Romance' },
          { id: 'terror', name: 'Terror/Suspenso' },
          { id: 'policial', name: 'Policial/Misterio' },
          { id: 'historica', name: 'Histórica' }
        ]
      },
      {
        id: 'no_ficcion',
        name: 'No Ficción',
        icon: '📰',
        items: [
          { id: 'biografia', name: 'Biografías' },
          { id: 'historia', name: 'Historia' },
          { id: 'ciencia', name: 'Ciencia' },
          { id: 'autoayuda', name: 'Autoayuda' },
          { id: 'negocios', name: 'Negocios' },
          { id: 'cocina_libros', name: 'Cocina' },
          { id: 'viajes', name: 'Viajes' }
        ]
      },
      {
        id: 'academicos',
        name: 'Académicos',
        icon: '🎓',
        items: [
          { id: 'universitarios', name: 'Universitarios' },
          { id: 'secundarios', name: 'Secundarios' },
          { id: 'primarios', name: 'Primarios' },
          { id: 'idiomas_libros', name: 'Idiomas' },
          { id: 'tecnico', name: 'Técnicos' }
        ]
      },
      {
        id: 'infantil',
        name: 'Infantil/Juvenil',
        icon: '🧒',
        items: [
          { id: 'cuentos', name: 'Cuentos' },
          { id: 'juvenil', name: 'Juvenil' },
          { id: 'comics', name: 'Comics/Manga' },
          { id: 'educativos', name: 'Educativos' }
        ]
      },
      {
        id: 'revistas',
        name: 'Revistas/Otros',
        icon: '📰',
        items: [
          { id: 'revistas', name: 'Revistas' },
          { id: 'enciclopedias', name: 'Enciclopedias' },
          { id: 'diccionarios', name: 'Diccionarios' },
          { id: 'colecciones', name: 'Colecciones' }
        ]
      }
    ]
  },
  
  {
    id: 'deportes',
    name: 'Deportes',
    icon: '⚽',
    color: '#FF9800',
    subcategories: [
      {
        id: 'futbol',
        name: 'Fútbol',
        icon: '⚽',
        items: [
          { id: 'pelota_futbol', name: 'Pelotas' },
          { id: 'botines', name: 'Botines' },
          { id: 'camisetas_futbol', name: 'Camisetas' },
          { id: 'canilleras', name: 'Canilleras' },
          { id: 'arcos', name: 'Arcos' }
        ]
      },
      {
        id: 'gimnasio',
        name: 'Gimnasio/Fitness',
        icon: '💪',
        items: [
          { id: 'pesas', name: 'Pesas/Mancuernas' },
          { id: 'colchoneta', name: 'Colchonetas' },
          { id: 'bandas', name: 'Bandas elásticas' },
          { id: 'maquinas', name: 'Máquinas' },
          { id: 'ropa_gym', name: 'Ropa deportiva' }
        ]
      },
      {
        id: 'ciclismo',
        name: 'Ciclismo',
        icon: '🚴',
        items: [
          { id: 'bicicleta', name: 'Bicicletas' },
          { id: 'casco_bici', name: 'Cascos' },
          { id: 'luces_bici', name: 'Luces' },
          { id: 'candado', name: 'Candados' },
          { id: 'accesorios_bici', name: 'Accesorios' }
        ]
      },
      {
        id: 'natacion',
        name: 'Natación',
        icon: '🏊',
        items: [
          { id: 'traje_bano', name: 'Trajes de baño' },
          { id: 'antiparras', name: 'Antiparras' },
          { id: 'gorra_natacion', name: 'Gorras' },
          { id: 'flotadores', name: 'Flotadores' }
        ]
      },
      {
        id: 'tenis',
        name: 'Tenis/Paddle',
        icon: '🎾',
        items: [
          { id: 'raqueta', name: 'Raquetas' },
          { id: 'pelotas_tenis', name: 'Pelotas' },
          { id: 'bolso_tenis', name: 'Bolsos' }
        ]
      },
      {
        id: 'running',
        name: 'Running',
        icon: '🏃',
        items: [
          { id: 'zapatillas_running', name: 'Zapatillas' },
          { id: 'ropa_running', name: 'Ropa' },
          { id: 'relojes_deportivos', name: 'Relojes GPS' }
        ]
      },
      {
        id: 'camping',
        name: 'Camping/Outdoor',
        icon: '⛺',
        items: [
          { id: 'carpa', name: 'Carpas' },
          { id: 'bolsa_dormir', name: 'Bolsas de dormir' },
          { id: 'mochila_camping', name: 'Mochilas' },
          { id: 'linterna', name: 'Linternas' },
          { id: 'conservadora', name: 'Conservadoras' }
        ]
      },
      {
        id: 'otros_deportes',
        name: 'Otros deportes',
        icon: '🏆',
        items: [
          { id: 'basketball', name: 'Basketball' },
          { id: 'volleyball', name: 'Volleyball' },
          { id: 'rugby', name: 'Rugby' },
          { id: 'hockey', name: 'Hockey' },
          { id: 'skate', name: 'Skate/Roller' },
          { id: 'golf', name: 'Golf' },
          { id: 'pesca', name: 'Pesca' }
        ]
      }
    ]
  },
  
  {
    id: 'musica',
    name: 'Música',
    icon: '🎵',
    color: '#673AB7',
    subcategories: [
      {
        id: 'cuerdas',
        name: 'Cuerdas',
        icon: '🎸',
        items: [
          { id: 'guitarra_acustica', name: 'Guitarra acústica' },
          { id: 'guitarra_electrica', name: 'Guitarra eléctrica' },
          { id: 'bajo', name: 'Bajo' },
          { id: 'violin', name: 'Violín' },
          { id: 'ukelele', name: 'Ukelele' },
          { id: 'charango', name: 'Charango' }
        ]
      },
      {
        id: 'teclados',
        name: 'Teclados',
        icon: '🎹',
        items: [
          { id: 'piano', name: 'Piano' },
          { id: 'teclado_musical', name: 'Teclado' },
          { id: 'sintetizador', name: 'Sintetizador' },
          { id: 'acordeon', name: 'Acordeón' }
        ]
      },
      {
        id: 'percusion',
        name: 'Percusión',
        icon: '🥁',
        items: [
          { id: 'bateria', name: 'Batería' },
          { id: 'cajon', name: 'Cajón peruano' },
          { id: 'bongo', name: 'Bongos' },
          { id: 'congas', name: 'Congas' },
          { id: 'tambor', name: 'Tambores' }
        ]
      },
      {
        id: 'viento',
        name: 'Viento',
        icon: '🎺',
        items: [
          { id: 'flauta', name: 'Flauta' },
          { id: 'saxofon', name: 'Saxofón' },
          { id: 'trompeta', name: 'Trompeta' },
          { id: 'clarinete', name: 'Clarinete' },
          { id: 'armonica', name: 'Armónica' }
        ]
      },
      {
        id: 'audio_musica',
        name: 'Audio/DJ',
        icon: '🎧',
        items: [
          { id: 'amplificador', name: 'Amplificadores' },
          { id: 'parlantes_musica', name: 'Parlantes' },
          { id: 'mixer', name: 'Mixer/Consolas' },
          { id: 'microfonos_musica', name: 'Micrófonos' },
          { id: 'auriculares_musica', name: 'Auriculares' },
          { id: 'controlador_dj', name: 'Controladores DJ' }
        ]
      },
      {
        id: 'accesorios_musica',
        name: 'Accesorios',
        icon: '🎼',
        items: [
          { id: 'cuerdas_repuesto', name: 'Cuerdas' },
          { id: 'puas', name: 'Púas' },
          { id: 'afinador', name: 'Afinadores' },
          { id: 'atril', name: 'Atriles' },
          { id: 'funda', name: 'Fundas/Estuches' },
          { id: 'pedales', name: 'Pedales/Efectos' }
        ]
      },
      {
        id: 'vinilos',
        name: 'Vinilos/CDs',
        icon: '💿',
        items: [
          { id: 'vinilos', name: 'Vinilos' },
          { id: 'cds', name: 'CDs' },
          { id: 'cassettes', name: 'Cassettes' },
          { id: 'tocadiscos', name: 'Tocadiscos' }
        ]
      }
    ]
  },
  
  {
    id: 'servicios',
    name: 'Servicios',
    icon: '🛠️',
    color: '#607D8B',
    subcategories: [
      {
        id: 'profesionales',
        name: 'Profesionales',
        icon: '💼',
        items: [
          { id: 'diseno_grafico', name: 'Diseño gráfico' },
          { id: 'programacion_serv', name: 'Programación' },
          { id: 'traduccion', name: 'Traducción' },
          { id: 'fotografia_serv', name: 'Fotografía' },
          { id: 'video', name: 'Video/Edición' },
          { id: 'marketing', name: 'Marketing' }
        ]
      },
      {
        id: 'clases',
        name: 'Clases',
        icon: '📚',
        items: [
          { id: 'idiomas_clase', name: 'Idiomas' },
          { id: 'musica_clase', name: 'Música' },
          { id: 'deportes_clase', name: 'Deportes' },
          { id: 'cocina_clase', name: 'Cocina' },
          { id: 'apoyo_escolar', name: 'Apoyo escolar' },
          { id: 'informatica', name: 'Informática' }
        ]
      },
      {
        id: 'hogar_servicios',
        name: 'Hogar',
        icon: '🏠',
        items: [
          { id: 'plomeria', name: 'Plomería' },
          { id: 'electricidad', name: 'Electricidad' },
          { id: 'pintura', name: 'Pintura' },
          { id: 'jardineria_serv', name: 'Jardinería' },
          { id: 'limpieza_serv', name: 'Limpieza' },
          { id: 'mudanza', name: 'Mudanzas' }
        ]
      },
      {
        id: 'salud_bienestar',
        name: 'Salud/Bienestar',
        icon: '💆',
        items: [
          { id: 'masajes', name: 'Masajes' },
          { id: 'yoga_serv', name: 'Yoga' },
          { id: 'personal_trainer', name: 'Personal trainer' },
          { id: 'nutricion', name: 'Nutrición' },
          { id: 'peluqueria', name: 'Peluquería' },
          { id: 'manicura', name: 'Manicura' }
        ]
      },
      {
        id: 'eventos',
        name: 'Eventos',
        icon: '🎉',
        items: [
          { id: 'animacion', name: 'Animación' },
          { id: 'dj_evento', name: 'DJ' },
          { id: 'catering', name: 'Catering' },
          { id: 'decoracion', name: 'Decoración' },
          { id: 'fotografia_evento', name: 'Fotografía' }
        ]
      },
      {
        id: 'vehiculos_serv',
        name: 'Vehículos',
        icon: '🚗',
        items: [
          { id: 'mecanica', name: 'Mecánica' },
          { id: 'lavado', name: 'Lavado' },
          { id: 'transporte', name: 'Transporte' }
        ]
      }
    ]
  },
  
  {
    id: 'vehiculos',
    name: 'Vehículos',
    icon: '🚗',
    color: '#795548',
    subcategories: [
      {
        id: 'autos',
        name: 'Autos',
        icon: '🚗',
        items: [
          { id: 'sedan', name: 'Sedán' },
          { id: 'suv', name: 'SUV' },
          { id: 'pickup', name: 'Pickup' },
          { id: 'hatchback', name: 'Hatchback' }
        ]
      },
      {
        id: 'motos',
        name: 'Motos',
        icon: '🏍️',
        items: [
          { id: 'moto_calle', name: 'Calle' },
          { id: 'scooter', name: 'Scooter' },
          { id: 'moto_cross', name: 'Cross' },
          { id: 'cuatriciclo', name: 'Cuatriciclo' }
        ]
      },
      {
        id: 'bicicletas_vehiculo',
        name: 'Bicicletas',
        icon: '🚲',
        items: [
          { id: 'bici_urbana', name: 'Urbana' },
          { id: 'bici_montaña', name: 'Montaña' },
          { id: 'bici_ruta', name: 'Ruta' },
          { id: 'bici_electrica', name: 'Eléctrica' },
          { id: 'bici_niño', name: 'Infantil' }
        ]
      },
      {
        id: 'repuestos',
        name: 'Repuestos',
        icon: '🔧',
        items: [
          { id: 'neumaticos', name: 'Neumáticos' },
          { id: 'baterias', name: 'Baterías' },
          { id: 'accesorios_auto', name: 'Accesorios' }
        ]
      }
    ]
  },
  
  {
    id: 'juguetes',
    name: 'Juguetes/Niños',
    icon: '🧸',
    color: '#E91E63',
    subcategories: [
      {
        id: 'bebes',
        name: 'Bebés',
        icon: '👶',
        items: [
          { id: 'cochecito', name: 'Cochecitos' },
          { id: 'cuna', name: 'Cunas' },
          { id: 'silla_auto', name: 'Sillas de auto' },
          { id: 'juguetes_bebe', name: 'Juguetes bebé' }
        ]
      },
      {
        id: 'juguetes_ninos',
        name: 'Juguetes',
        icon: '🧸',
        items: [
          { id: 'muñecos', name: 'Muñecos' },
          { id: 'autos_juguete', name: 'Autos' },
          { id: 'lego', name: 'LEGO/Construcción' },
          { id: 'peluches', name: 'Peluches' },
          { id: 'juegos_mesa', name: 'Juegos de mesa' }
        ]
      },
      {
        id: 'exterior_ninos',
        name: 'Exterior',
        icon: '🛝',
        items: [
          { id: 'bici_nino', name: 'Bicicletas' },
          { id: 'patines', name: 'Patines/Rollers' },
          { id: 'pelota_nino', name: 'Pelotas' },
          { id: 'pileta', name: 'Piletas' }
        ]
      }
    ]
  },
  
  {
    id: 'arte',
    name: 'Arte/Coleccionables',
    icon: '🎨',
    color: '#FF5722',
    subcategories: [
      {
        id: 'arte_visual',
        name: 'Arte visual',
        icon: '🖼️',
        items: [
          { id: 'pinturas', name: 'Pinturas' },
          { id: 'esculturas', name: 'Esculturas' },
          { id: 'fotografias', name: 'Fotografías' },
          { id: 'grabados', name: 'Grabados' }
        ]
      },
      {
        id: 'materiales_arte',
        name: 'Materiales',
        icon: '🖌️',
        items: [
          { id: 'pinturas_mat', name: 'Pinturas' },
          { id: 'pinceles', name: 'Pinceles' },
          { id: 'lienzos', name: 'Lienzos' },
          { id: 'lapices', name: 'Lápices/Carbón' }
        ]
      },
      {
        id: 'coleccionables',
        name: 'Coleccionables',
        icon: '🏆',
        items: [
          { id: 'monedas', name: 'Monedas' },
          { id: 'estampillas', name: 'Estampillas' },
          { id: 'figuras', name: 'Figuras' },
          { id: 'cartas', name: 'Cartas/Trading cards' },
          { id: 'antiguedades', name: 'Antigüedades' }
        ]
      }
    ]
  }
]

// =====================================================
// FUNCIÓN HELPER PARA OBTENER CATEGORÍA POR ID
// =====================================================

export function getCategoryById(categoryId) {
  return CATEGORIES.find(cat => cat.id === categoryId)
}

export function getSubcategoryById(categoryId, subcategoryId) {
  const category = getCategoryById(categoryId)
  if (!category) return null
  return category.subcategories?.find(sub => sub.id === subcategoryId)
}

export function getItemById(categoryId, subcategoryId, itemId) {
  const subcategory = getSubcategoryById(categoryId, subcategoryId)
  if (!subcategory) return null
  return subcategory.items?.find(item => item.id === itemId)
}

// =====================================================
// CATEGORÍAS SIMPLIFICADAS PARA SELECCIÓN RÁPIDA
// =====================================================

export const CATEGORIES_SIMPLE = CATEGORIES.map(cat => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  color: cat.color
}))

// =====================================================
// HOSPEDAJE - TRUEQUE STAY
// =====================================================

export const SPACE_TYPES = [
  { id: 'private', name: 'Habitación Privada', icon: '🚪', description: 'Tu propio cuarto con privacidad' },
  { id: 'shared', name: 'Habitación Compartida', icon: '🛏️', description: 'Compartes cuarto con otros' },
  { id: 'entire', name: 'Espacio Completo', icon: '🏡', description: 'Todo el lugar para ti' },
  { id: 'couch', name: 'Sofá', icon: '🛋️', description: 'Un sofá cómodo para dormir' }
]

export const AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'cocina', name: 'Cocina', icon: '🍳' },
  { id: 'bano_privado', name: 'Baño Privado', icon: '🚿' },
  { id: 'parking', name: 'Estacionamiento', icon: '🚗' },
  { id: 'ac', name: 'Aire Acondicionado', icon: '❄️' },
  { id: 'calefaccion', name: 'Calefacción', icon: '🔥' },
  { id: 'workspace', name: 'Espacio de Trabajo', icon: '💼' },
  { id: 'lavadora', name: 'Lavadora', icon: '🧺' },
  { id: 'mascotas', name: 'Mascotas Permitidas', icon: '🐕' },
  { id: 'tv', name: 'TV', icon: '📺' },
  { id: 'piscina', name: 'Piscina', icon: '🏊' },
  { id: 'jardin', name: 'Jardín', icon: '🌳' }
]

export const HOSPEDAJE_EXCHANGE_TYPES = {
  trabajo: {
    name: 'Trabajo Doméstico',
    icon: '🏠',
    options: [
      { id: 'limpieza', name: 'Limpieza', icon: '🧹', hours: '2-3 horas/día' },
      { id: 'cocinar', name: 'Cocinar', icon: '👨‍🍳', hours: '1-2 horas/día' },
      { id: 'jardineria', name: 'Jardinería', icon: '🌱', hours: '2-3 horas/día' },
      { id: 'mascotas', name: 'Cuidar mascotas', icon: '🐕', hours: '1-2 horas/día' },
      { id: 'lavanderia', name: 'Lavandería', icon: '🧺', hours: '1 hora/día' },
      { id: 'compras', name: 'Hacer compras', icon: '🛒', hours: '1 hora/día' }
    ]
  },
  habilidades: {
    name: 'Habilidades Profesionales',
    icon: '💼',
    options: [
      { id: 'diseno', name: 'Diseño gráfico', icon: '🎨', hours: '3-4 horas/día' },
      { id: 'programacion', name: 'Programación', icon: '💻', hours: '3-4 horas/día' },
      { id: 'idiomas', name: 'Enseñar idiomas', icon: '🗣️', hours: '1-2 horas/día' },
      { id: 'fotografia', name: 'Fotografía', icon: '📸', hours: '2-3 horas/día' },
      { id: 'redes_sociales', name: 'Redes sociales', icon: '📱', hours: '2-3 horas/día' },
      { id: 'contabilidad', name: 'Contabilidad', icon: '📊', hours: '2-3 horas/día' }
    ]
  },
  compania: {
    name: 'Compañía & Experiencias',
    icon: '🤝',
    options: [
      { id: 'poesia', name: 'Leer poesía', icon: '📜', hours: '1 hora/día' },
      { id: 'historias', name: 'Contar historias', icon: '📖', hours: '1 hora/día' },
      { id: 'musica_vivo', name: 'Tocar música', icon: '🎸', hours: '1-2 horas/día' },
      { id: 'juegos', name: 'Juegos de mesa', icon: '🎲', hours: '1-2 horas/día' },
      { id: 'conversacion', name: 'Conversación', icon: '💬', hours: '1-2 horas/día' },
      { id: 'pasear', name: 'Pasear/Acompañar', icon: '🚶', hours: '1-2 horas/día' },
      { id: 'cuidado_ancianos', name: 'Acompañar ancianos', icon: '👴', hours: '2-3 horas/día' }
    ]
  },
  ensenanza: {
    name: 'Enseñanza',
    icon: '📚',
    options: [
      { id: 'musica_clase', name: 'Clases de música', icon: '🎹', hours: '1-2 horas/día' },
      { id: 'cocina_clase', name: 'Clases de cocina', icon: '🍳', hours: '1-2 horas/día' },
      { id: 'yoga', name: 'Yoga/Meditación', icon: '🧘', hours: '1 hora/día' },
      { id: 'baile', name: 'Clases de baile', icon: '💃', hours: '1 hora/día' },
      { id: 'arte', name: 'Arte/Manualidades', icon: '🎨', hours: '1-2 horas/día' },
      { id: 'deportes_clase', name: 'Deportes', icon: '⚽', hours: '1-2 horas/día' },
      { id: 'tecnologia_clase', name: 'Tecnología', icon: '💻', hours: '1-2 horas/día' }
    ]
  }
}

// =====================================================
// CONDICIONES DE PRODUCTOS
// =====================================================

export const CONDITIONS = [
  { id: 'nuevo', name: 'Nuevo', icon: '✨', description: 'Sin usar, en su empaque original' },
  { id: 'como_nuevo', name: 'Como nuevo', icon: '🌟', description: 'Usado una o dos veces, perfecto estado' },
  { id: 'muy_bueno', name: 'Muy bueno', icon: '👍', description: 'Poco uso, excelente estado' },
  { id: 'bueno', name: 'Bueno', icon: '👌', description: 'Uso normal, funciona perfectamente' },
  { id: 'aceptable', name: 'Aceptable', icon: '🤏', description: 'Signos de uso, funcional' },
  { id: 'para_reparar', name: 'Para reparar', icon: '🔧', description: 'Necesita reparación' }
]

// =====================================================
// DISTANCIAS PARA BÚSQUEDA
// =====================================================

export const DISTANCES = [
  { id: 1, name: '1 km', value: 1 },
  { id: 5, name: '5 km', value: 5 },
  { id: 10, name: '10 km', value: 10 },
  { id: 25, name: '25 km', value: 25 },
  { id: 50, name: '50 km', value: 50 },
  { id: 100, name: '100 km', value: 100 }
]