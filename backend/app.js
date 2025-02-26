//TEST WITH GOOGLE OAUTH
require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
  secret: 'secret', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using https
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

//Database Connection with Idle Timeout handling
let connection;

function connectToDatabase() {
  connection = mysql.createConnection({
    host: 'webapps4-db.miserver.it.umich.edu',
    user: 'southasiandictionarydb',
    password: 'h8u@lce@EfXK6k!2',
    database: 'southasiandictionarydb',
    port: 3306,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      setTimeout(connectToDatabase, 5000); // Retry connection after 5 seconds
    } else {
      console.log('Connected to the database');
    }
  });

  connection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Reconnecting to the database...');
      connectToDatabase(); // Reconnect if the connection is lost
    } else {
      throw err;
    }
  });
}

// Initialize the connection
connectToDatabase();
//End Database Connection with Idle Timeout handling

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // Example: Save user info in session or database
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware Setup
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define Routers
const router = express.Router();
const authRouter = express.Router();

// Database Routes
router.get('/api/test-connection', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).send('Database connection error');
    }
    res.send(`Database test successful: ${results[0].solution}`);
  });
});

router.get('/api/words', (req, res) => {
  connection.query(
    `SELECT w.word_id, w.english_word, t.translation_id, t.translated_word, t.word_class, t.pronunciation, t.synonym, t.usage_sentence, t.audio_file
     FROM words w
     LEFT JOIN translations t ON w.word_id = t.word_id`, 
    (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database query error');
    }

    // Structure the data into a more usable format
    const wordData = results.reduce((acc, row) => {
      const { english_word, translation_id, translated_word, word_class, pronunciation, synonym, usage_sentence, audio_file } = row;

      if (!acc[english_word]) {
        acc[english_word] = { english_word, translations: {} };
      }

      acc[english_word].translations[translation_id] = {
        translated_word,
        word_class,
        pronunciation,
        synonym,
        usage_sentence,
        audio_file,
      };

      return acc;
    }, {});

    res.json(Object.values(wordData));
  });
});



//CONTENT MANAGEMENT API
// New API endpoint for content management
// router.get('/api/content/words', (req, res) => {
//   connection.query(
//     `SELECT 
//       w.word_id,
//       w.english_word,
//       w.picture,
//       t.translations_id,
//       t.translation_id,
//       t.word_id AS translation_word_id,
//       t.translated_word,
//       t.word_class,
//       t.pronunciation,
//       t.synonym,
//       t.usage_sentence,
//       t.audio_file
//     FROM words w
//     LEFT JOIN translations t ON w.word_id = t.word_id`,
//     (err, results) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         return res.status(500).send('Database query error');
//       }

//       // Structure the data with word_id included
//       const wordData = results.reduce((acc, row) => {
//         const wordId = row.word_id;
        
//         if (!acc[wordId]) {
//           acc[wordId] = {
//             word_id: wordId,
//             english_word: row.english_word,
//             picture: row.picture,
//             translations: {}
//           };
//         }

//         if (row.translation_id !== null) {
//           acc[wordId].translations[row.translation_id] = {
//             translations_id: row.translations_id,
//             translation_id: row.translation_id,
//             translated_word: row.translated_word,
//             word_class: row.word_class,
//             pronunciation: row.pronunciation,
//             synonym: row.synonym,
//             usage_sentence: row.usage_sentence,
//             audio_file: row.audio_file
//           };
//         }

//         return acc;
//       }, {});

//       res.json(Object.values(wordData));
//     }
//   );
// });
router.get('/api/content/words', (req, res) => {
  connection.query(
    `SELECT 
      w.word_id,
      w.english_word,
      w.picture,
      t.translations_id,
      t.translation_id,
      t.word_id AS translation_word_id,
      t.translated_word,
      t.word_class,
      t.pronunciation,
      t.synonym,
      t.usage_sentence,
      CASE WHEN t.audio_file IS NOT NULL THEN true ELSE false END as has_audio
    FROM words w
    LEFT JOIN translations t ON w.word_id = t.word_id`,
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Database query error');
      }

      // Structure the data with word_id included
      const wordData = results.reduce((acc, row) => {
        const wordId = row.word_id;
        
        if (!acc[wordId]) {
          acc[wordId] = {
            word_id: wordId,
            english_word: row.english_word,
            picture: row.picture,
            translations: {}
          };
        }

        if (row.translation_id !== null) {
          acc[wordId].translations[row.translation_id] = {
            translations_id: row.translations_id,
            translation_id: row.translation_id,
            translated_word: row.translated_word,
            word_class: row.word_class,
            pronunciation: row.pronunciation,
            synonym: row.synonym,
            usage_sentence: row.usage_sentence,
            has_audio: row.has_audio
          };
        }

        return acc;
      }, {});

      res.json(Object.values(wordData));
    }
  );
});

router.get('/api/words/:wordId', (req, res) => {
  const wordId = req.params.wordId;
  
  connection.query(
    `SELECT w.*, t.translation_id, t.translated_word, t.word_class, t.pronunciation, 
            t.synonym, t.usage_sentence, t.audio_file
     FROM words w
     LEFT JOIN translations t ON w.word_id = t.word_id
     WHERE w.word_id = ?`,
    [wordId],
    (err, results) => {
      if (err) {
        console.error('Error fetching word:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Word not found' });
      }
      
      // Format the response
      const word = {
        word_id: results[0].word_id,
        english_word: results[0].english_word,
        picture: results[0].picture,
        translations: {}
      };
      
      results.forEach(row => {
        if (row.translation_id) {
          word.translations[row.translation_id] = {
            translation_id: row.translation_id,
            translated_word: row.translated_word,
            word_class: row.word_class,
            pronunciation: row.pronunciation,
            synonym: row.synonym,
            usage_sentence: row.usage_sentence,
            audio_file: row.audio_file
          };
        }
      });
      
      res.json(word);
    }
  );
});

router.get('/api/translations/:translationId', (req, res) => {
  const translationId = req.params.translationId;
  
  connection.query(
    `SELECT t.*, w.english_word 
     FROM translations t
     JOIN words w ON t.word_id = w.word_id
     WHERE t.translations_id = ?`,
    [translationId],
    (err, results) => {
      if (err) {
        console.error('Error fetching translation:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Translation not found' });
      }
      
      const translation = results[0];
      res.json({
        id: translation.translations_id,
        wordId: translation.word_id,
        englishWord: translation.english_word,
        translatedWord: translation.translated_word,
        wordClass: translation.word_class,
        pronunciation: translation.pronunciation,
        synonym: translation.synonym,
        usageSentence: translation.usage_sentence,
        languageIndex: translation.translation_id
      });
    }
  );
});

// // Update translation
// router.put('/api/translations/:translationId', (req, res) => {
//   const translationId = req.params.translationId;
//   const { translated_word, word_class, pronunciation, synonym, usage_sentence } = req.body;
  
//   connection.query(
//     `UPDATE translations 
//      SET translated_word = ?,
//          word_class = ?,
//          pronunciation = ?,
//          synonym = ?,
//          usage_sentence = ?
//      WHERE translations_id = ?`,
//     [translated_word, word_class, pronunciation, synonym, usage_sentence, translationId],
//     (err, result) => {
//       if (err) {
//         console.error('Error updating translation:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
      
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'Translation not found' });
//       }
      
//       res.json({ message: 'Translation updated successfully' });
//     }
//   );
// });
router.put('/api/translations/:translationId', (req, res) => {
  const translationId = req.params.translationId;
  const { 
    translated_word, 
    word_class, 
    pronunciation, 
    synonym, 
    usage_sentence,
    audioFile  // New field for audio
  } = req.body;
  
  let query = `
    UPDATE translations 
    SET translated_word = ?,
        word_class = ?,
        pronunciation = ?,
        synonym = ?,
        usage_sentence = ?
  `;
  let params = [translated_word, word_class, pronunciation, synonym, usage_sentence];

  // If new audio file is provided
  if (audioFile && audioFile.startsWith('data:audio')) {
    const base64Data = audioFile.split(',')[1];
    const audioBuffer = Buffer.from(base64Data, 'base64');
    query += ', audio_file = ?';
    params.push(audioBuffer);
  }

  query += ' WHERE translations_id = ?';
  params.push(translationId);
  
  connection.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating translation:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Translation not found' });
    }
    
    res.json({ message: 'Translation updated successfully' });
  });
});

// Add new translation
router.post('/api/translations', (req, res) => {
  const { word_id, translation_id, translated_word, word_class, pronunciation, synonym, usage_sentence } = req.body;
  
  connection.query(
    `INSERT INTO translations 
     (word_id, translation_id, translated_word, word_class, pronunciation, synonym, usage_sentence)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [word_id, translation_id, translated_word, word_class, pronunciation, synonym, usage_sentence],
    (err, result) => {
      if (err) {
        console.error('Error adding translation:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ 
        message: 'Translation added successfully',
        translation_id: result.insertId 
      });
    }
  );
});

// Delete translation
// Modified delete endpoints
router.delete('/api/words/:wordId', (req, res) => {
  const wordId = req.params.wordId;
  
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // First delete all translations for this word
    connection.query(
      'DELETE FROM translations WHERE word_id = ?',
      [wordId],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Failed to delete translations' });
          });
        }

        // Then delete the word itself
        connection.query(
          'DELETE FROM words WHERE word_id = ?',
          [wordId],
          (err, result) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Failed to delete word' });
              });
            }

            if (result.affectedRows === 0) {
              return connection.rollback(() => {
                res.status(404).json({ error: 'Word not found' });
              });
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Commit error' });
                });
              }
              res.json({ message: 'Word and all translations deleted successfully' });
            });
          }
        );
      }
    );
  });
});

// Modified translations delete (soft delete)
router.delete('/api/translations/:translationId', (req, res) => {
  const translationId = req.params.translationId;
  
  connection.query(
    `UPDATE translations 
     SET 
       translated_word = 'N/A',
       word_class = NULL,
       pronunciation = NULL,
       synonym = NULL,
       usage_sentence = NULL,
       audio_file = NULL
     WHERE translations_id = ?`,
    [translationId],
    (err, result) => {
      if (err) {
        console.error('Error soft deleting translation:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Translation not found' });
      }
      
      res.json({ message: 'Translation soft deleted successfully' });
    }
  );
});

// Get audio file for a translation
router.get('/api/translations/:translationId/audio', (req, res) => {
  const translationId = req.params.translationId;
  
  connection.query(
    'SELECT audio_file FROM translations WHERE translations_id = ?',
    [translationId],
    (err, results) => {
      if (err) {
        console.error('Error fetching audio:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0 || !results[0].audio_file) {
        return res.status(404).json({ error: 'Audio not found' });
      }
      
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', results[0].audio_file.length);
      res.setHeader('Accept-Ranges', 'bytes');
      res.send(results[0].audio_file);
    }
  );
});

// Update word
// router.put('/api/words/:wordId', async (req, res) => {
//   const wordId = req.params.wordId;
//   const { english_word, picture } = req.body;
  
//   try {
//     let query = 'UPDATE words SET english_word = ?';
//     let params = [english_word];
    
//     // If picture is provided (as base64), include it in the update
//     if (picture && picture.startsWith('data:image')) {
//       // Convert base64 to buffer
//       const base64Data = picture.split(',')[1];
//       const imageBuffer = Buffer.from(base64Data, 'base64');
      
//       query += ', picture = ?';
//       params.push(imageBuffer);
//     }
    
//     query += ' WHERE word_id = ?';
//     params.push(wordId);
    
//     connection.query(query, params, (err, result) => {
//       if (err) {
//         console.error('Error updating word:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
      
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'Word not found' });
//       }
      
//       res.json({ message: 'Word updated successfully' });
//     });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ error: 'Failed to process image' });
//   }
// });

router.put('/api/words/:wordId', async (req, res) => {
  const wordId = req.params.wordId;
  const { english_word, picture } = req.body;
  
  try {
    // Start with basic query for english_word update
    let query = 'UPDATE words SET english_word = ?';
    let params = [english_word];
    
    // Only include picture in update if it's provided and is a base64 image
    if (picture && typeof picture === 'string' && picture.startsWith('data:image')) {
      const base64Data = picture.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
      query += ', picture = ?';
      params.push(imageBuffer);
    }
    
    query += ' WHERE word_id = ?';
    params.push(wordId);
    
    connection.query(query, params, (err, result) => {
      if (err) {
        console.error('Error updating word:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Word not found' });
      }
      
      res.json({ message: 'Word updated successfully' });
    });
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).json({ error: 'Failed to process update' });
  }
});

// Add this route to fetch the image
router.get('/api/words/:wordId/image', (req, res) => {
  const wordId = req.params.wordId;
  
  connection.query(
    'SELECT picture FROM words WHERE word_id = ?',
    [wordId],
    (err, results) => {
      if (err) {
        console.error('Error fetching image:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0 || !results[0].picture) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(results[0].picture);
    }
  );
});

//create new word
// Check if word exists
router.get('/api/words/check/:word', (req, res) => {
  const word = req.params.word;
  
  connection.query(
    'SELECT EXISTS(SELECT 1 FROM words WHERE english_word = ?) as english_exists',
    [word],
    (err, results) => {
      if (err) {
        console.error('Error checking word:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ exists: results[0].exists === 1 });
    }
  );
});

router.post('/api/words', (req, res) => {
  const { englishWord, picture } = req.body;
  
  // Process image if provided
  let imageBuffer = null;
  if (picture && picture.startsWith('data:image')) {
    const base64Data = picture.split(',')[1];
    imageBuffer = Buffer.from(base64Data, 'base64');
  }
  
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Insert the English word with image
    connection.query(
      'INSERT INTO words (english_word, picture) VALUES (?, ?)',
      [englishWord, imageBuffer],
      (err, result) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Failed to create word' });
          });
        }

        const wordId = result.insertId;
        
        // Create default translations for all languages (1 through 6)
        const translationValues = [1, 2, 3, 4, 5, 6].map(langId => [
          wordId,
          langId,
          'N/A',
          null,
          null,
          null,
          null,
          ''
        ]);

        connection.query(
          `INSERT INTO translations 
           (word_id, translation_id, translated_word, word_class, pronunciation, synonym, usage_sentence, audio_file)
           VALUES ?`,
          [translationValues],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Failed to create translations' });
              });
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Commit error' });
                });
              }
              res.json({ 
                word_id: wordId,
                english_word: englishWord,
                picture: imageBuffer ? true : false,
                translations: {}
              });
            });
          }
        );
      }
    );
  });
});

// Add an endpoint to fetch word image
router.get('/api/words/:wordId/picture', (req, res) => {
  const wordId = req.params.wordId;
  
  connection.query(
    'SELECT picture FROM words WHERE word_id = ?',
    [wordId],
    (err, results) => {
      if (err) {
        console.error('Error fetching image:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0 || !results[0].picture) {
        console.log('No image found for word ID:', wordId);
        return res.status(404).json({ error: 'Image not found' });
      }
      
      console.log('Image found for word ID:', wordId, 'Size:', results[0].picture.length);
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(results[0].picture);
    }
  );
});

//USER MANAGEMENT API
// Get all users
router.get('/api/users', (req, res) => {
  const query = `
    SELECT u.email, u.role, GROUP_CONCAT(sl.language) as languages
    FROM users u
    LEFT JOIN sysadmin_languages sl ON u.email = sl.email
    GROUP BY u.email, u.role
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const users = results.map(user => ({
      ...user,
      languages: user.languages ? user.languages.split(',') : []
    }));
    
    res.json(users);
  });
});

// Create new user
router.post('/api/users', (req, res) => {
  const { email, role, languages } = req.body;
  
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Insert user
    connection.query(
      'INSERT INTO users (email, role) VALUES (?, ?)',
      [email, role],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(400).json({ error: 'Failed to create user' });
          });
        }

        // If sysadmin, insert languages
        if (role === 'sysadmin' && languages && languages.length) {
          const languageValues = languages.map(lang => [email, lang]);
          
          connection.query(
            'INSERT INTO sysadmin_languages (email, language) VALUES ?',
            [languageValues],
            (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(400).json({ error: 'Failed to add languages' });
                });
              }
              
              connection.commit(err => {
                if (err) {
                  return connection.rollback(() => {
                    res.status(500).json({ error: 'Commit error' });
                  });
                }
                res.json({ message: 'User created successfully' });
              });
            }
          );
        } else {
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Commit error' });
              });
            }
            res.json({ message: 'User created successfully' });
          });
        }
      }
    );
  });
});

// Delete user
router.delete('/api/users/:email', (req, res) => {
  const email = req.params.email;
  
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Delete from sysadmin_languages first (if exists)
    connection.query(
      'DELETE FROM sysadmin_languages WHERE email = ?',
      [email],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(400).json({ error: 'Failed to delete user languages' });
          });
        }

        // Then delete from users
        connection.query(
          'DELETE FROM users WHERE email = ?',
          [email],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(400).json({ error: 'Failed to delete user' });
              });
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Commit error' });
                });
              }
              res.json({ message: 'User deleted successfully' });
            });
          }
        );
      }
    );
  });
});

// Check if user exists endpoint
router.get('/api/users/check/:email', (req, res) => {
  const email = req.params.email;
  
  connection.query(
    'SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) as user_exists',  // Changed 'exists' to 'user_exists'
    [email],
    (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ exists: results[0].user_exists === 1 });
    }
  );
});





// Google Authentication Routes
router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account',
}));

// Helper function to check user access
const checkUserAccess = async (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT u.email, u.role, GROUP_CONCAT(sl.language) as languages 
       FROM users u 
       LEFT JOIN sysadmin_languages sl ON u.email = sl.email 
       WHERE u.email = ?
       GROUP BY u.email, u.role`,
      [email],
      (err, results) => {
        if (err) reject(err);
        resolve(results[0] || null);
      }
    );
  });
};

// Middleware to check authentication
const checkAuth = (req, res, next) => {
  if (!req.session.userRole) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Middleware to check manager role
const checkManager = (req, res, next) => {
  if (req.session.userRole !== 'manager') {
    return res.status(403).json({ error: 'Forbidden: Manager access required' });
  }
  next();
};

// Middleware to check language access for sysadmin
const checkLanguageAccess = async (req, res, next) => {
  if (req.session.userRole === 'manager') {
    return next(); // Managers have access to all languages
  }

  if (req.session.userRole !== 'sysadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // For translation updates, check if sysadmin has access to the language
  if (req.params.translationId) {
    try {
      const [translation] = await connection.promise().query(
        'SELECT translation_id FROM translations WHERE translations_id = ?',
        [req.params.translationId]
      );

      if (!translation.length) {
        return res.status(404).json({ error: 'Translation not found' });
      }

      const languageId = translation[0].translation_id;
      const language = LANGUAGE_MAP[languageId].toLowerCase();

      if (!req.session.languages.includes(language)) {
        return res.status(403).json({ error: 'Forbidden: No access to this language' });
      }
    } catch (error) {
      console.error('Error checking language access:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  next();
};

// Update Google callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const userEmail = req.user.emails[0].value;
      const userAccess = await checkUserAccess(userEmail);

      if (!userAccess) {
        // No access - clear session and redirect
        req.logout((err) => {
          if (err) console.error(err);
          res.redirect('http://localhost:3000?error=unauthorized');
        });
        return;
      }

      // Store user info in session
      req.session.userEmail = userEmail;
      req.session.userRole = userAccess.role;
      req.session.languages = userAccess.languages ? userAccess.languages.split(',') : [];
      
      // Set proper CORS headers
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      
      // Redirect to content management page
      res.redirect('http://localhost:3000/content');
    } catch (error) {
      console.error('Auth error:', error);
      res.redirect('http://localhost:3000?error=system');
    }
  }
);

// Add new endpoint to check current user's session
router.get('/api/auth/session', (req, res) => {
  if (!req.session.userRole) {
    res.json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    email: req.session.userEmail,
    role: req.session.userRole,
    languages: req.session.languages
  });
});

router.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});



//Server
// Apply the `/node` prefix to the database routes
// app.use('/node', router);
app.use('/', router);

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
