from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            self.set_font('Helvetica', 'B', 24)
            self.set_text_color(30, 50, 100)
            self.cell(0, 20, 'Photons: The Messengers of Reality', 0, 1, 'C')
            self.set_font('Helvetica', 'I', 14)
            self.set_text_color(80, 80, 80)
            self.cell(0, 10, 'A Journey into Quantum Weirdness', 0, 1, 'C')
            self.ln(10)
        else:
            self.set_font('Helvetica', 'I', 10)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, 'Photons: The Messengers of Reality', 0, 0, 'R')
            self.ln(15)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 10)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')
    
    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 18)
        self.set_text_color(30, 50, 100)
        self.cell(0, 15, title, 0, 1, 'L')
        self.ln(2)
    
    def section_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(50, 80, 130)
        self.cell(0, 12, title, 0, 1, 'L')
        self.ln(1)
    
    def body_text(self, text, bold=False):
        self.set_font('Helvetica', 'B' if bold else '', 11)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 6, text)
        self.ln(2)
    
    def quote_text(self, text):
        self.set_font('Helvetica', 'I', 11)
        self.set_text_color(60, 60, 60)
        self.set_left_margin(25)
        self.multi_cell(0, 6, f'"{text}"')
        self.set_left_margin(15)
        self.ln(3)
    
    def bullet_text(self, text):
        self.set_font('Helvetica', '', 11)
        self.set_text_color(0, 0, 0)
        self.cell(5)
        self.cell(5, 6, chr(149), 0, 0, 'L')
        self.multi_cell(0, 6, text)
        self.ln(1)

# Create PDF
pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# Introduction
pdf.section_title('Introduction')
pdf.body_text('What is light? The question has puzzled humanity for millennia. Is it a wave? A particle? Both? Neither? As we will discover, the answer is far stranger than any of our intuitions can grasp. This document explores the nature of photons the fundamental particles of light and reveals how they challenge everything we think we know about reality, time, space, and information itself.')

# Chapter 1
pdf.add_page()
pdf.chapter_title('Chapter 1: The Wave-Particle Paradox')

pdf.section_title('The Common Misconception')
pdf.body_text('Many people believe light behaves as a particle in a medium and as a wave in a vacuum. This is incorrect.')

pdf.section_title('The Truth')
pdf.body_text('Light is ALWAYS both wave and particle. What you observe depends on how you measure it, not where it is.')

pdf.section_title('Key Experiments:')
pdf.bullet_text('Double-slit experiment: Shows wave (interference pattern) in Vacuum OR medium')
pdf.bullet_text('Photoelectric effect: Shows particle (photons knocking electrons) in Vacuum OR medium')
pdf.bullet_text('Refraction: Shows wave behavior (bending) in a medium')
pdf.bullet_text('Compton scattering: Shows particle (billiard ball collisions) in Vacuum')

pdf.section_title('The Observer Effect')
pdf.quote_text('Light travels as a wave, arrives as a particle, and the universe decides which face to show based on what you are looking for.')

pdf.body_text('The Double-Slit Paradox:', bold=True)
pdf.bullet_text('Fire single photons one at a time through two slits')
pdf.bullet_text('Each photon hits the screen like a particle (one dot)')
pdf.bullet_text('But over time, they form a wave interference pattern')
pdf.bullet_text('If you try to measure which slit it went through, the pattern disappears')

pdf.body_text('The Lesson: The medium does not determine light nature consciousness of observation does.')

# Chapter 2
pdf.add_page()
pdf.chapter_title('Chapter 2: Does Light Travel?')

pdf.section_title('The Question')
pdf.body_text('If light exhibits wave-particle duality, does it actually travel from point A to point B?')

pdf.section_title('The Answer: Yes, But Weirdly')
pdf.body_text('From our perspective (Earth frame):', bold=True)
pdf.bullet_text('Light leaves the Sun')
pdf.bullet_text('Travels 8 minutes 20 seconds')
pdf.bullet_text('Covers 150 million kilometers')
pdf.bullet_text('Arrives at Earth')

pdf.body_text('The math is undeniable:')
pdf.bullet_text('Speed of light: 299,792,458 m/s (exactly)')
pdf.bullet_text('Time across a room: ~3 nanoseconds')

pdf.section_title('Quantum Travel')
pdf.body_text('In quantum mechanics, light does not take one path it takes ALL possible paths simultaneously:')
pdf.ln(3)
pdf.set_font('Courier', '', 10)
pdf.cell(15)
pdf.cell(0, 5, 'Classical:  A ---------------- B (one straight line)', 0, 1)
pdf.ln(2)
pdf.cell(15)
pdf.cell(0, 5, 'Quantum:    A ===|=|=|=|--> B (all paths at once)', 0, 1)
pdf.cell(15)
pdf.cell(0, 5, '                    |   |   |', 0, 1)
pdf.cell(15)
pdf.cell(0, 5, '                (infinite paths superimposed)', 0, 1)
pdf.ln(5)
pdf.body_text('At the destination, all paths interfere with each other. Most cancel out, leaving the classical path as the most likely outcome.')

pdf.section_title('The Bottom Line')
pdf.bullet_text('Does light move from A to B? YES')
pdf.bullet_text('Does it follow one path? NO explores all paths')
pdf.bullet_text('Does it take time? YES finite speed')
pdf.bullet_text('Can we track its journey? NO measuring collapses it')

# Chapter 3
pdf.add_page()
pdf.chapter_title('Chapter 3: The Speed of Light Intrinsic or Imposed?')

pdf.section_title('Why Do Photons Travel at Speed c?')
pdf.body_text('Photons do not get velocity they ARE velocity. They have zero rest mass, which means they must travel at exactly c or they cannot exist.')

pdf.section_title('The Mass-Speed Relationship')
pdf.bullet_text('Electron (mass: 9.11 x 10^-31 kg) Speed: 0 to < c')
pdf.bullet_text('Proton (mass: 1.67 x 10^-27 kg) Speed: 0 to < c')
pdf.bullet_text('Photon (mass: 0 kg) Speed: Exactly c')

pdf.body_text('Key insight: Anything with mass can sit still. Anything with zero mass must move at c.')

pdf.section_title('c A Fundamental Constant')
pdf.body_text('The speed of light is not something photons achieve it is baked into spacetime:')
pdf.ln(2)
pdf.set_font('Courier', 'B', 12)
pdf.cell(0, 8, 'c = 1/sqrt(e0*u0)', 0, 1, 'C')
pdf.ln(2)
pdf.set_font('Helvetica', '', 11)
pdf.body_text('Where e0 (electric permittivity) and u0 (magnetic permeability) are fundamental constants of empty space. Light travels at c because that is the universe update rate for information.')

# Chapter 4
pdf.add_page()
pdf.chapter_title('Chapter 4: The Photon Perspective No Time, No Space')

pdf.section_title('The Impossible Reference Frame')
pdf.body_text('From the photon point of view:')
pdf.bullet_text('No time passes. Zero. Literally 0 seconds.')
pdf.bullet_text('Distance contracts to zero. (Infinite length contraction at v = c)')
pdf.bullet_text('Emission and absorption happen simultaneously.')

pdf.section_title('The Mathematical Problem')
pdf.body_text('The Lorentz factor: y = 1/sqrt(1-v^2/c^2)')
pdf.ln(2)
pdf.body_text('At v = c, y becomes infinity. The math breaks down.')
pdf.ln(2)
pdf.body_text('Photons have NO valid reference frame. You cannot ride along with a photon.')

pdf.section_title('What This Really Means')
pdf.body_text('From our perspective: Photon leaves Sun travels 8 minutes hits Earth')
pdf.ln(2)
pdf.body_text('From the photon perspective (forcing the math):')
pdf.bullet_text('Distance = 0')
pdf.bullet_text('Time = 0')
pdf.bullet_text('Emission = Absorption')
pdf.ln(2)
pdf.body_text('But this is not a place you can point to. It is a null geodesic a line in spacetime where causality happens, but no observer can exist on it.')

# Chapter 5
pdf.add_page()
pdf.chapter_title('Chapter 5: Photons as Information')

pdf.section_title('The Classical View')
pdf.body_text('Messages are encoded as 0s and 1s, sent through fiber optics using billions of photons.')

pdf.section_title('The Quantum View')
pdf.body_text('Photons ARE the 0s and 1s but quantum-style:')
pdf.ln(2)
pdf.bullet_text('Classical computer bit: 0 OR 1 (definitely one or the other)')
pdf.bullet_text('Photon qubit: |0> + |1> (both simultaneously)')

pdf.section_title('Encoding Information in Photons')
pdf.body_text('One photon can represent:')
pdf.bullet_text('Polarized vertically (up arrow) = 0')
pdf.bullet_text('Polarized horizontally (right arrow) = 1')
pdf.bullet_text('Polarized diagonally (diagonal arrow) = BOTH 0 AND 1 (superposition)')

pdf.section_title('The Quantum Advantage')
pdf.bullet_text('Send message: Classical YES, Quantum YES')
pdf.bullet_text('Spy-proof encryption: Classical NO (crackable), Quantum YES (physically unhackable)')
pdf.bullet_text('Quantum teleportation: Classical NO (sci-fi), Quantum YES (real)')
pdf.bullet_text('Exist in two states: Classical NO (impossible), Quantum YES (natural)')

pdf.body_text('Quantum Cryptography: If Eve tries to intercept your photon message, she must measure it, which changes it. You instantly know someone spied.')

# Chapter 6
pdf.add_page()
pdf.chapter_title('Chapter 6: It from Bit Reality as Information')

pdf.section_title('John Wheeler Vision')
pdf.quote_text('Every physical quantity derives its ultimate significance from bits binary yes-or-no indications. Every it every particle, every field of force, even the spacetime continuum itself derives its function, its meaning, its very existence from the apparatus-elicited answers to yes-or-no questions.')

pdf.body_text('Translation: Reality IS information.')

pdf.section_title('The Example: Seeing a Chair')
pdf.bullet_text('Photons bounce off chair')
pdf.bullet_text('Carry information about shape, color, position')
pdf.bullet_text('Your brain receives information')
pdf.bullet_text('The chair exists for you as that information')
pdf.ln(2)
pdf.body_text('Without photons bringing that information, the chair might as well not exist (to you).')

pdf.section_title('What Information Do Photons Carry?')
pdf.bullet_text('Energy/Frequency -> Source temperature')
pdf.bullet_text('Wavelength/Color -> Which atoms emitted it')
pdf.bullet_text('Polarization -> Orientation of emitting electron')
pdf.bullet_text('Phase -> Timing and position')
pdf.bullet_text('Direction -> Location of the source')

pdf.section_title('The Deepest Answer')
pdf.body_text('Photons carry causality itself.')
pdf.ln(2)
pdf.body_text('The universe is a giant computation. Photons are how different parts of the universe know about each other.')
pdf.ln(2)
pdf.bullet_text('No photons = no information exchange')
pdf.bullet_text('No information exchange = causally disconnected regions')
pdf.bullet_text('These regions exist in separate bubble universes')
pdf.ln(2)
pdf.body_text('Photons are not messengers. They are the relationship itself, made physical.')

# Chapter 7
pdf.add_page()
pdf.chapter_title('Chapter 7: Synthesis The Nature of Light')

pdf.section_title('Bringing It All Together')
pdf.ln(2)

concepts = [
    ('Wave-particle duality', 'Light reveals what you ask it to reveal'),
    ('All-paths travel', 'The universe explores every possibility'),
    ('Speed c', 'The fundamental limit of causality'),
    ('No rest frame', 'Photons connect events without experiencing them'),
    ('Information carriers', 'Light IS the relationship between phenomena'),
    ('Quantum bits', 'Photons are reality fundamental data packets')
]

for concept, meaning in concepts:
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(60, 7, concept, 0, 0)
    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 7, f'-> {meaning}', 0, 1)
    pdf.ln(1)

pdf.ln(5)

pdf.section_title('The Final Analogy')
pdf.body_text('Think of the universe as a vast network:')
pdf.bullet_text('Nodes: Stars, planets, atoms, people')
pdf.bullet_text('Connections: Photons (and other force carriers)')
pdf.bullet_text('Information: What makes the network real')
pdf.ln(2)
pdf.body_text('Without connections, nodes are isolated existing but unaware. Photons are the protocol by which the universe communicates with itself.')

# Conclusion
pdf.add_page()
pdf.chapter_title('Conclusion: Why This Matters')

pdf.body_text('Understanding photons is not just academic curiosity. It reveals:')
pdf.ln(3)

pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(30, 50, 100)
pdf.cell(0, 8, '1. The Limits of Intuition', 0, 1)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0, 0, 0)
pdf.multi_cell(0, 6, 'Reality is stranger than our senses suggest.')
pdf.ln(2)

pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(30, 50, 100)
pdf.cell(0, 8, '2. The Nature of Information', 0, 1)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0, 0, 0)
pdf.multi_cell(0, 6, 'Physics and computation are deeply connected.')
pdf.ln(2)

pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(30, 50, 100)
pdf.cell(0, 8, '3. The Future of Technology', 0, 1)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0, 0, 0)
pdf.multi_cell(0, 6, 'Quantum computing, quantum internet, quantum cryptography.')
pdf.ln(2)

pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(30, 50, 100)
pdf.cell(0, 8, '4. Our Place in the Universe', 0, 1)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0, 0, 0)
pdf.multi_cell(0, 6, 'We are patterns of information, illuminated by light.')
pdf.ln(5)

pdf.body_text('The next time you see sunlight, remember: you are not just seeing a star. You are witnessing the universe most fundamental process the exchange of information that makes existence possible.')
pdf.ln(3)

pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(30, 50, 100)
pdf.multi_cell(0, 8, 'Reality is not made of things. It is made of relationships. And photons are how those relationships become real.')

# Further Reading
pdf.add_page()
pdf.chapter_title('Further Reading')

books = [
    'The Quantum Universe by Brian Cox and Jeff Forshaw',
    'QED: The Strange Theory of Light and Matter by Richard Feynman',
    'Information: A Very Short Introduction by Luciano Floridi',
    'John Wheeler It from Bit essay in the Proceedings of the 3rd International Symposium on Quantum Mechanics'
]

for book in books:
    pdf.bullet_text(book)

pdf.ln(10)
pdf.set_font('Helvetica', 'I', 10)
pdf.set_text_color(100, 100, 100)
pdf.multi_cell(0, 6, 'Document created from deep conversations about the nature of light, reality, and information.')

# Save PDF
output_path = '/home/dell/.openclaw/workspace/photons_messengers_of_reality.pdf'
pdf.output(output_path)
print(f'PDF created successfully: {output_path}')
print(f'File size: {os.path.getsize(output_path)} bytes')