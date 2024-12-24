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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connection = mysql.createConnection({
  host: 'webapps4-db.miserver.it.umich.edu',
  user: 'southasiandictionarydb',
  password: 'h8u@lce@EfXK6k!2',
  database: 'southasiandictionarydb',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database');
});

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

// router.get('/api/words', (req, res) => {
//   connection.query('SELECT * FROM words', (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).send('Database query error');
//     }
//     res.json(results);
//   });
// });

router.get('/api/words', (req, res) => {
  connection.query(
    `SELECT w.english_word, t.translation_id, t.translated_word, t.word_class, t.pronunciation, t.synonym, t.usage_sentence, t.audio_file
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
      t.audio_file
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
            audio_file: row.audio_file
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

// Update translation
router.put('/api/translations/:translationId', (req, res) => {
  const translationId = req.params.translationId;
  const { translated_word, word_class, pronunciation, synonym, usage_sentence } = req.body;
  
  connection.query(
    `UPDATE translations 
     SET translated_word = ?,
         word_class = ?,
         pronunciation = ?,
         synonym = ?,
         usage_sentence = ?
     WHERE translations_id = ?`,
    [translated_word, word_class, pronunciation, synonym, usage_sentence, translationId],
    (err, result) => {
      if (err) {
        console.error('Error updating translation:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Translation not found' });
      }
      
      res.json({ message: 'Translation updated successfully' });
    }
  );
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

// Update word
router.put('/api/words/:wordId', (req, res) => {
  const wordId = req.params.wordId;
  const { english_word } = req.body;
  
  connection.query(
    'UPDATE words SET english_word = ? WHERE word_id = ?',
    [english_word, wordId],
    (err, result) => {
      if (err) {
        console.error('Error updating word:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Word not found' });
      }
      
      res.json({ message: 'Word updated successfully' });
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

router.get('/api/users/check/:email', (req, res) => {
  const email = req.params.email;
  
  connection.query(
    'SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) as exists',
    [email],
    (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ exists: results[0].exists === 1 });
    }
  );
});





// Google Authentication Routes
router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account',
}));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/node/welcome');
  }
);

router.get('/welcome', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.send(`
    <h1>Welcome ${req.user.displayName}</h1>
    <p>Email: ${req.user.emails[0].value}</p>
    <a href="/logout">Logout</a>
  `);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      const googleLogoutURL = `https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${encodeURIComponent('http://localhost:3000')}`;
      res.redirect(googleLogoutURL);
    });
  });
});

router.get('/login', (req, res) => {
  res.send('<h1>Login with Google</h1><a href="/node/auth/google">Login</a>');
});

// Apply the `/node` prefix to the database routes
// app.use('/node', router);
app.use('/', router);

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});