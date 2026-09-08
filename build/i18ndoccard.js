(function(){/* ===================================================================
   i18ndoccard — the ONE sentence a doctor's profile card says, in 16
   languages (IDS, 1 Sep 2026).

   `fp_doctor_no_chat` is drawn by friendprofile.jsx where the friendship
   buttons would be, because 1:1 chat is patient ↔ patient. It had NEVER
   existed in a dictionary: t() returned the key, the code's English
   fallback shipped raw, and 15 languages read an English line.

   It was invisible until today for a bad reason: a doctor could only
   reach that branch through a `doc:` uid, and the census hands over cloud
   uids, so nobody ever saw the card. Now that `role` routes doctors
   correctly (cfFriendIsDoctor), the sentence is reachable from «All
   people» — and it must speak the patient's language.

   Exactly the blind spot CLAUDE.md warns about: a key-based t() with an
   English fallback in the code is never found by grepping for tr('.

   Merged into CF_DICT MERGE-IF-MISSING, so it can only fill a gap and
   never changes a word another screen already shows.
   Loaded after build/i18n19.js (which owns the other fp_* keys).
   =================================================================== */(function(){if(typeof CF_DICT==='undefined')return;var M={en:"Doctors share guidance through posts & comments, not private chats.",es:"Los médicos comparten sus consejos en publicaciones y comentarios, no en chats privados.",ca:"Els metges comparteixen els seus consells en publicacions i comentaris, no en xats privats.",fr:"Les médecins partagent leurs conseils dans les publications et les commentaires, pas dans des discussions privées.",de:"Ärzte teilen ihren Rat in Beiträgen und Kommentaren, nicht in privaten Chats.",it:"I medici condividono i loro consigli nei post e nei commenti, non nelle chat private.",pt:"Os médicos partilham os seus conselhos em publicações e comentários, não em chats privados.",zh:"医生通过帖子和评论分享建议，而不是私聊。",ja:"医師は投稿とコメントで助言を届けます。プライベートチャットではありません。",ko:"의사는 게시물과 댓글로 조언을 나눠요. 비공개 채팅으로는 하지 않아요.",hi:"डॉक्टर अपनी सलाह पोस्ट और टिप्पणियों में देते हैं, निजी चैट में नहीं।",id:"Dokter membagikan sarannya lewat postingan dan komentar, bukan obrolan pribadi.",tr:"Doktorlar önerilerini gönderilerde ve yorumlarda paylaşır, özel sohbetlerde değil.",ru:"Врачи делятся советами в публикациях и комментариях, а не в личных чатах.",vi:"Bác sĩ chia sẻ lời khuyên qua bài viết và bình luận, không qua trò chuyện riêng.",ar:"يشارك الأطباء إرشاداتهم في المنشورات والتعليقات، لا في المحادثات الخاصة."};Object.keys(M).forEach(function(l){CF_DICT[l]=CF_DICT[l]||{};if(!CF_DICT[l].fp_doctor_no_chat)CF_DICT[l].fp_doctor_no_chat=M[l];});})();
})();