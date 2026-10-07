(() => {
  const SAVE_KEY = 'detective-recipe-scenario-v20';
  const TEST_UNLOCK_ALL_LOCATIONS = false; // final player mode

  const locations = {
    hall:{title:'Главный зал', cls:'location-hall', img:'assets/locations/hall.png', open:true, desc:'Юбилейный ужин. Здесь можно восстановить алиби гостей и общую хронологию.'},
    office:{title:'Кабинет Виктора', cls:'location-office', img:'assets/locations/office.png', open:true, desc:'Витрина, письменный стол, сейф и финансовые документы Виктора.'},
    kitchen:{title:'Кухня', cls:'location-kitchen', img:'assets/locations/kitchen.png', open:true, desc:'Рабочие записи Антона, электрощит и служебные принадлежности.'},
    corridor:{title:'Служебный коридор', cls:'location-corridor', img:'assets/locations/corridor.png', open:true, desc:'Камеры фиксируют перемещения Виктора и Марины.'},
    staff:{title:'Комната персонала', cls:'location-staff', img:'assets/locations/staffroom.png', open:false, desc:'Личные вещи, доска смен и служебные ключи.'},
    cellar:{title:'Винный погреб', cls:'location-cellar', img:'assets/locations/wine cellar.png', open:false, desc:'Служебный маршрут Лизы и тайник с фотографиями страниц.'},
    archive:{title:'Семейный архив', cls:'location-archive', img:'assets/locations/archive.png', open:false, desc:'Семейные документы, история сейфа и возможное место, где могла оказаться книга.'}
  };

  const evidenceDefs = {
    emptyCase:{name:'Пустая витрина', icon:'▣', place:'Кабинет Виктора', desc:'Витрина заперта, следов взлома нет. Если после демонстрации книга туда не возвращалась, отключение света не объясняет ее исчезновение.'},
    dustMark:{name:'След книги на столе', icon:'▱', place:'Кабинет Виктора', desc:'Чистый прямоугольный след на пыльной поверхности совпадает с размером семейной книги.'},
    safe:{name:'Сейф без следов взлома', icon:'▦', place:'Кабинет Виктора', desc:'Сейф открыт и пуст. Следов взлома нет; внутри достаточно места для книги.'},
    insurance:{name:'Страховой полис', icon:'§', place:'Кабинет Виктора', desc:'Страховая стоимость семейной книги была заметно увеличена незадолго до юбилея.'},
    financialDoc:{name:'Финансовые документы Виктора', icon:'▤', place:'Кабинет Виктора', desc:'Документы показывают серьезные кассовые проблемы ресторана и черновик обращения к страховщику на случай утраты ценного имущества.'},
    camera:{name:'Кадр с камеры 20:26', icon:'◉', place:'Служебный коридор', desc:'Виктор выходит из кабинета с обычной папкой документов. Папка заметно меньше семейной книги; книги при нем нет.'},
    cameraMarina:{name:'Кадр с камеры 20:34', icon:'◉', place:'Служебный коридор', desc:'Марина проходит по служебному коридору со свертком размером примерно с семейную книгу.'},
    hallPhoto:{name:'Кадр юбилейного тоста 20:33', icon:'◉', place:'Главный зал', desc:'На снимке юбилейного тоста Виктор, Марина, Дмитрий и сотрудники ресторана находятся в зале. Павла Зорина среди присутствующих нет.'},
    breakerLog:{name:'Запись о сработавшем автомате', icon:'⚡', place:'Кухня', desc:'Кухонный журнал фиксирует перегрузку и срабатывание автомата около 20:28. Отключение света было бытовой аварией.'},
    copiedRecipe:{name:'Старая копия рецепта', icon:'✎', place:'Кухня', desc:'В рабочих бумагах Антона найдена копия фирменного рецепта.'},
    kitchenLog:{name:'Старый журнал кухни', icon:'▤', place:'Кухня', desc:'Запись пятилетней давности подтверждает, что рабочая копия рецепта существовала задолго до нынешнего исчезновения.'},
    kitchenOrders:{name:'Лента заказов кухни', icon:'▤', place:'Кухня', desc:'Серия заказов, обработанных подряд в критический промежуток, подтверждает, что Антон оставался на кухне и продолжал выдавать блюда.'},
    linenNapkin:{name:'Недостающая льняная салфетка', icon:'▱', place:'Кухня', desc:'Из комплекта больших льняных салфеток не хватает одной. Антон вспоминает, что Марина попросила такую после восстановления света.'},
    staffKey:{name:'Служебный ключ персонала', icon:'⌘', place:'Кухня', desc:'На служебной связке есть ключ от комнаты персонала. Это альтернативный способ попасть туда без разговора с Лизой.'},
    lizaPayment:{name:'Перевод Лизе', icon:'₽', place:'Комната персонала', desc:'На телефоне Лизы видно крупное поступление от человека, связанного с Павлом Зориным.'},
    staffSchedule:{name:'Доска смен', icon:'▤', place:'Комната персонала', desc:'На доске смен на день юбилея напротив Лизы указана вечерняя смена. Отметки о замене сотрудника или выходном нет.'},
    lizaExit:{name:'Кадр служебного выхода 20:29', icon:'◉', place:'Служебный коридор', desc:'Камера у служебного выхода фиксирует Лизу уже в гражданской одежде, с рабочей формой в руках. Она покидает ресторан после смены.'},
    cellarNote:{name:'Отметка о винном погребе', icon:'✎', place:'Комната персонала', desc:'В вещах Лизы есть короткая пометка о конверте в винном погребе.'},
    archiveKey:{name:'Ключ от семейного архива', icon:'⌘', place:'Комната персонала', desc:'Старый ключ с биркой «Архив» дает альтернативный путь в семейный архив.'},
    recipePhotos:{name:'Конверт с фотографиями страниц', icon:'▧', place:'Винный погреб', desc:'В конверте находятся фотографии отдельных страниц книги. На конверте есть отметка Павла.'},
    oldPhoto:{name:'Старая фотография Марины у сейфа', icon:'▧', place:'Семейный архив', desc:'Марина изображена рядом с отцом у семейного сейфа задолго до нынешних событий.'},
    familyCode:{name:'Запись о семейном коде', icon:'⌘', place:'Семейный архив', desc:'Запись подтверждает, что код сейфа основан на дате рождения отца Виктора и Марины и много лет не менялся.'},
    archiveLetter:{name:'Письмо отца Дмитрия', icon:'✉', place:'Семейный архив', desc:'Письмо подтверждает, что отец Дмитрия помогал Орловым работать с семейным архивом.'},
    dmitryRecorder:{name:'Диктофон Дмитрия', icon:'◉', place:'Главный зал', desc:'Диктофон вел непрерывную запись в главном зале в критический промежуток. На записи слышны Дмитрий и происходящий в зале юбилейный тост.'},
    archiveOwnership:{name:'Документ о семейной принадлежности книги', icon:'§', place:'Семейный архив', desc:'Документ показывает, что книга воспринималась семьей как общая реликвия, а не как личная собственность Виктора.'},
    foundBook:{name:'Семейная книга рецептов', icon:'★', place:'Семейный архив', desc:'Книга найдена среди старых архивных коробов. Она завернута в плотную льняную ткань.'}
  };

  const evidenceImageMap = {
    hallPhoto:'assets/evidence/hallPhoto.png',
    emptyCase:'assets/evidence/emptyCase.png',
    dustMark:'assets/evidence/dustMark.png',
    safe:'assets/evidence/safe.png',
    insurance:'assets/evidence/insurance.png',
    financialDoc:'assets/evidence/financialDoc.png',
    camera:'assets/evidence/camera.png',
    cameraMarina:'assets/evidence/cameraMarina.png',
    breakerLog:'assets/evidence/breakerLog.png',
    copiedRecipe:'assets/evidence/copiedRecipe.png',
    kitchenLog:'assets/evidence/kitchenLog.png',
    kitchenOrders:'assets/evidence/kitchenOrders.png',
    linenNapkin:'assets/evidence/linenNapkin.png',
    staffKey:'assets/evidence/staffKey.png',
    lizaPayment:'assets/evidence/lizaPayment.png',
    staffSchedule:'assets/evidence/staffSchedule.png',
    lizaExit:'assets/evidence/lizaExit.png',
    cellarNote:'assets/evidence/cellarNote.png',
    archiveKey:'assets/evidence/archiveKey.png',
    recipePhotos:'assets/evidence/recipePhotos.png',
    oldPhoto:'assets/evidence/oldPhoto.png',
    familyCode:'assets/evidence/familyCode.png',
    archiveLetter:'assets/evidence/archiveLetter.png',
    dmitryRecorder:'assets/evidence/dmitryRecorder.png',
    archiveOwnership:'assets/evidence/archiveOwnership.png',
    foundBook:'assets/evidence/foundBook.png'
  };

  function evidenceVisual(id, fallbackIcon='?'){
    const src=evidenceImageMap[id];
    return src
      ? `<img class="evidence-thumb" src="${src}" alt="">`
      : `<span class="evidence-thumb-fallback">${fallbackIcon}</span>`;
  }

  const evidenceDetectiveNotes = {
    emptyCase:'Витрина заперта, и следов взлома нет. Значит, ее мог взять тот, кто имел к ней доступ, если она вообще была в витрине на момент кражи.',
    dustMark:'След на столе совпадает с размером книги. Это уже можно сопоставить со словами Дмитрия о том, что после демонстрации книга оставалась в кабинете. Следует подтвердить или опровергнуть этот факт.',
    safe:'Сейф не взломан. Если книга действительно была внутри, открыть его мог тот, у кого был код.',
    insurance:'Похоже ресторанный бизнес Орловых столкнулся с финансовыми проблемами. И это подтверждается документами. Нужно понять, был ли у Виктора мотив инсценировать пропажу книги ради выплаты страховки. Стоит попытаться установить последовательность событий между тем фактом, что после демонстрации книга была на столе, на сейфе нет следов взлома, а у Виктора был финансовый мотив.',
    financialDoc:'Похоже ресторанный бизнес Орловых столкнулся с финансовыми проблемами. Нужно понять, был ли у Виктора мотив инсценировать пропажу книги ради выплаты страховки, сравнив найденные финансовые документы Виктора и страховой полис.',
    camera:'На записи Виктор выходит с очень тонкой папкой в руке. Книга рецептов в ней не поместится, значит, этот кадр можно пока рассматривать как подтверждение того, что книга на тот момент еще оставалась в кабинете. Тем не менее, следует установить последовательность событий того факта, что после демонстрации книга была на столе с кадром с камеры, сделанным в 20:26 и тем фактом, что сейф не имеет следов взлома.',
    cameraMarina:'В 20:34 Марина проходит по служебному коридору со свертком. Сам по себе кадр ничего не доказывает, но на время и размер свертка следует обратить внимание. Следует установить последовательность событий между этим снимком и тем фактом, что Марина имела доступ к сейфу.',
    hallPhoto:'На снимке указано время 20:33. Виктор, Марина, Дмитрий и сотрудники ресторана находятся в зале, а Павла среди них нет. Нужно выяснить, где он находился в этот момент и почему отсутствовал на тосте.',
    breakerLog:'Можно ли подтвердить показание Антона о том, что причиной отключения стала перегрузка электросети. Нужно найти журнал контроля. Возможно, темнота была лишь случайным обстоятельством, которым кто-то воспользовался.',
    copiedRecipe:'У Антона действительно была копия рецепта соуса. Нужно установить, мог ли он похитить книгу ради этого рецепта или это отдельная старая история.',
    kitchenLog:'Журнал показывает, что копия рецепта соуса существовала задолго до нынешнего вечера. Эта находка может подтверждать невиновность Антона, но не исключает ее.',
    kitchenOrders:'Лента заказов показывает непрерывную работу кухни в критический промежуток. Это уже похоже на независимое подтверждение того, что Антон оставался на рабочем месте.',
    linenNapkin:'В комплекте не хватает большой льняной салфетки. Возможно, в нее что-то заворачивали, это может объяснить появление свертка в комнате персонала. Интересно, имеется ли последовательность событий между тем фактом, что Марина имела доступ к сейфу, недостающей льняной салфеткой и показаниями Антона по поводу салфетки.',
    staffKey:'Может ли комната персонала скрывать что-то о сотрудниках заведения?',
    lizaPayment:'Денежный перевод Лизе крупной суммы подтверждает ее скрытую связь с Павлом. Но пока это свидетельствует об их тайной сделке, но не является доказательством того, что именно Лиза украла книгу.',
    staffSchedule:'Лиза утверждала, что в день исчезновения книги не работала. Но по расписанию у нее была вечерняя смена, и отметки о замене нет. Значит, она соврала о своем присутствии в ресторане. Нужно вернуться к Лизе и потребовать объяснений.',
    lizaExit:'Камера подтверждает вторую версию Лизы: после смены она переоделась, забрала форму и действительно покинула ресторан через служебный выход. Ее первая ложь теперь выглядит как попытка скрыть нарушение на работе, а не кражу книги.',
    cellarNote:'Не стоит игнорировать винный погреб. Возможно, там сохранились улики, которые помогут понять, что именно скрывали Лиза и Павел.',
    archiveKey:'Ключ с биркой «Архив» позволяет продолжить поиски в семейном архиве Орловых. Удастся ли найти там что-то важное.',
    recipePhotos:'В конверте только фотографии отдельных страниц. Это подтверждает сделку Павла и Лизы, но не объясняет исчезновение самой книги.',
    oldPhoto:'На старой фотографии Марина стоит рядом с семейным сейфом. Ее слова о том, что она не знала о сейфе, теперь требуют объяснения. Следует установить противоречие между этими фактами и допросить ее по этому поводу и узнать, почему она скрыла этот факт.',
    familyCode:'Семейный код! Имела ли Марина доступ к коду от сейфа и возможность открыть его, воспользовавшись эти кодом?',
    archiveLetter:'Письмо подтверждает связь отца Дмитрия с семейным архивом Орловых. Его рассказ об этой части семейной истории получил независимое подтверждение.',
    dmitryRecorder:'Непрерывная запись из главного зала подтверждает присутствие Дмитрия в критический промежуток. Вместе с фотографией тоста это может дать ему полноценное алиби.',
    archiveOwnership:'Документы говорят о том, что книга считалась семейной реликвией. Это помогает понять, почему Марина часто спорила с Виктором о праве распоряжаться ею.',
    foundBook:'Теперь ясно, где оказалась книга. Но место находки — лишь конец пути. Чтобы картина стала полной, нужно связать последовательность двух событий: Виктор первым спрятал книгу в сейфе, но Марина переместила книгу.'
  };

  function getEvidenceDetectiveThought(id){
    return evidenceDetectiveNotes[id] || 'Эта находка добавляет новый факт к делу. Стоит сопоставить ее с уже полученными показаниями и хронологией.';
  }

  const deductionDefs = {
    bookOnDesk:{name:'После демонстрации книга была на столе',icon:'①',desc:'След на столе подтверждает показание Дмитрия: после демонстрации Виктор не вернул книгу в витрину.',relation:'confirmation',requires:['e:dustMark','t:dmitry:desk']},
    blackoutAccident:{name:'Отключение света было случайным',icon:'②',desc:'Запись о сработавшем автомате и показание Антона подтверждают бытовую причину отключения света.',relation:'confirmation',requires:['e:breakerLog','t:anton:blackout']},
    viktorFinancialMotive:{name:'У Виктора был финансовый интерес',icon:'③',desc:'Повышенная страховка и финансовые документы показывают реальный интерес к возможному страховому случаю.',relation:'motive',requires:['e:insurance','e:financialDoc']},
    viktorHidBookFinance:{name:'Виктор спрятал книгу в сейфе — финансовая ветка',icon:'④',desc:'Книга осталась в кабинете, сейф не был взломан, а финансовая ветка дает Виктору мотив создать видимость исчезновения.',relation:'sequence',requires:['d:bookOnDesk','e:safe','d:viktorFinancialMotive']},
    viktorHidBookCamera:{name:'Виктор спрятал книгу в сейфе — временная ветка',icon:'④',desc:'Книга была на столе, Виктор ушел без нее, а сейф в кабинете не был взломан. Цепочка указывает, что книга осталась внутри кабинета и была убрана в сейф.',relation:'sequence',requires:['d:bookOnDesk','e:camera','e:safe']},
    viktorHidBook:{name:'Виктор первым спрятал книгу в сейфе',icon:'④',desc:'Первый этап установлен: Виктор не вернул книгу в витрину и спрятал ее в сейфе своего кабинета.',derived:true,relation:null,requires:[]},
    marinaKnewSafe:{name:'Марина заранее знала о сейфе',icon:'⑤',desc:'Ее слова о случайной догадке противоречат старой фотографии у семейного сейфа.',relation:'contradiction',requires:['t:marina:knowledge','e:oldPhoto']},
    marinaAccessArchive:{name:'Марина могла открыть сейф — архивная ветка',icon:'⑥',desc:'Марина знала о сейфе, семейный код оставался действующим, а следов взлома нет.',relation:'opportunity',requires:['d:marinaKnewSafe','e:familyCode','e:safe']},
    marinaAccessDialogue:{name:'Марина могла открыть сейф — ветка признания кода',icon:'⑥',desc:'Марина знала семейный код; архивная запись подтверждает, что он оставался действующим, а сейф не был взломан.',relation:'opportunity',requires:['t:marina:code','e:familyCode','e:safe']},
    marinaAccess:{name:'Марина имела доступ к сейфу',icon:'⑥',desc:'Установлено, что Марина могла самостоятельно открыть сейф семейным кодом.',derived:true,relation:null,requires:[]},
    marinaFamilyMotive:{name:'У Марины был семейный мотив вмешаться',icon:'⑦',desc:'Ее слова о семейной реликвии согласуются с документами о принадлежности книги семье.',relation:'motive',requires:['t:marina:family','e:archiveOwnership']},
    marinaMovedCamera:{name:'Марина перенесла книгу — ветка камеры',icon:'⑧',desc:'Марина имела доступ к сейфу, а камера 20:34 фиксирует ее со свертком подходящего размера.',relation:'sequence',requires:['d:marinaAccess','e:cameraMarina']},
    marinaMovedKitchen:{name:'Марина перенесла книгу — ветка кухни',icon:'⑧',desc:'Марина имела доступ, а Антон подтверждает, что после отключения света она взяла большую льняную салфетку для свертка.',relation:'sequence',requires:['d:marinaAccess','e:linenNapkin','t:anton:napkin']},
    marinaMovedWitness:{name:'Марина перенесла книгу — ветка свидетеля',icon:'⑧',desc:'Марина имела доступ к сейфу, а Лиза видела ее в служебной части со свертком; недостающая льняная салфетка объясняет, во что могла быть завернута книга.',relation:'sequence',requires:['d:marinaAccess','e:linenNapkin','t:liza:marina']},
    marinaMovedBook:{name:'Марина переместила книгу после Виктора',icon:'⑧',desc:'Второй этап установлен: после действий Виктора Марина получила доступ к сейфу и перенесла книгу через служебную часть ресторана.',derived:true,relation:null,requires:[]},
    pavelLizaDeal:{name:'Павел и Лиза скрывали передачу фотографий',icon:'◇',desc:'Перевод, признание Лизы и конверт подтверждают тайную сделку за фотографии отдельных страниц книги.',relation:'confirmation',requires:['e:lizaPayment','t:liza:payment','e:recipePhotos']},
    antonOldCopy:{name:'Копия Антона не связана с нынешним исчезновением',icon:'◇',desc:'Старый журнал доказывает, что найденная копия существовала пять лет и относится к старому нарушению правил.',relation:'sequence',requires:['e:copiedRecipe','e:kitchenLog']},
    dmitryHistory:{name:'Интерес Дмитрия связан с семейной историей',icon:'◇',desc:'Письмо отца подтверждает рассказ Дмитрия о связи его семьи с архивом Орловых.',relation:'confirmation',requires:['e:archiveLetter','t:dmitry:father']},
    twoStages:{name:'Исчезновение состояло из двух отдельных действий',icon:'★',desc:'Сначала Виктор спрятал книгу в сейфе, затем Марина самостоятельно переместила ее.',relation:'sequence',requires:['d:viktorHidBook','d:marinaMovedBook']}
  };

  const finalDeductionIds = ['viktorHidBook','marinaAccess','marinaMovedBook'];

  // Новая механика расследования: вопрос -> версия -> доказательства -> хронология.
  // Игрок больше не выбирает абстрактный тип логической связи: игра определяет его сама
  // после успешного сопоставления материалов.
  const investigationQuestions = [
    {
      id:'bookAfterDemo', group:'main', number:1,
      title:'Где находилась книга после демонстрации?',
      prompt:'Определите, что произошло с книгой сразу после того, как Виктор показал ее гостям.',
      unlockAny:['e:dustMark','t:dmitry:desk'], solvedBy:['d:bookOnDesk'],
      hypotheses:[
        {id:'desk',text:'Книга осталась на письменном столе Виктора'},
        {id:'case',text:'Виктор сразу вернул книгу в витрину',showAny:['e:emptyCase']},
        {id:'dmitry',text:'Дмитрий забрал книгу после демонстрации',showAny:['t:dmitry:interest','t:dmitry:desk']}
      ],
      routes:[{hypothesis:'desk',deductionId:'bookOnDesk',requires:['e:dustMark','t:dmitry:desk']}]
    },
    {
      id:'blackout', group:'optional', number:2,
      title:'Было ли отключение света частью плана?',
      prompt:'Проверьте, было ли отключение света намеренным или кто-то лишь воспользовался случайной темнотой.',
      unlockAny:['e:breakerLog','t:anton:blackout'], solvedBy:['d:blackoutAccident'],
      hypotheses:[
        {id:'accident',text:'Отключение света было случайной бытовой аварией'},
        {id:'anton',text:'Антон специально отключил электричество',showAny:['t:anton:blackout']},
        {id:'planned',text:'Кто-то заранее подготовил саботаж электросети',showAny:['e:breakerLog']}
      ],
      routes:[{hypothesis:'accident',deductionId:'blackoutAccident',requires:['e:breakerLog','t:anton:blackout']}]
    },
    {
      id:'viktorMotive', group:'optional', number:3,
      title:'Был ли у Виктора финансовый мотив?',
      prompt:'Проверьте, могло ли исчезновение книги дать Виктору финансовую выгоду.',
      unlockAny:['e:insurance','e:financialDoc'], solvedBy:['d:viktorFinancialMotive'],
      hypotheses:[
        {id:'motive',text:'У Виктора был финансовый интерес к исчезновению книги'},
        {id:'nomotive',text:'Финансовые проблемы никак не связаны с книгой',showAny:['e:financialDoc','t:viktor:money']},
        {id:'sale',text:'Виктор собирался тайно продать книгу',showAny:['e:insurance','t:viktor:insurance']}
      ],
      routes:[{hypothesis:'motive',deductionId:'viktorFinancialMotive',requires:['e:insurance','e:financialDoc']}]
    },
    {
      id:'viktorAction', group:'main', number:4,
      title:'Что Виктор сделал с книгой перед выходом из кабинета?',
      prompt:'Восстановите первый этап исчезновения книги. Возможны разные пути доказательства одной версии.',
      unlockAny:['d:bookOnDesk','e:safe','e:camera','d:viktorFinancialMotive'], solvedBy:['d:viktorHidBook'],
      hypotheses:[
        {id:'safe',text:'Виктор спрятал книгу в сейфе кабинета'},
        {id:'carry',text:'Виктор вынес книгу из кабинета',showAny:['e:camera','t:viktor:before2026']},
        {id:'case',text:'Виктор вернул книгу в витрину',showAny:['e:emptyCase']},
        {id:'pavel',text:'Виктор передал книгу Павлу',showAny:['t:pavel:interest','t:pavel:payment','e:lizaPayment']}
      ],
      routes:[
        {hypothesis:'safe',deductionId:'viktorHidBookCamera',requires:['d:bookOnDesk','e:camera','e:safe']},
        {hypothesis:'safe',deductionId:'viktorHidBookFinance',requires:['d:bookOnDesk','e:safe','d:viktorFinancialMotive']}
      ]
    },
    {
      id:'marinaKnowledge', group:'main', number:5,
      title:'Говорит ли Марина правду о сейфе?',
      prompt:'Сопоставьте ее слова с независимыми материалами о прошлом семьи.',
      unlockAny:['t:marina:knowledge','e:oldPhoto'], solvedBy:['d:marinaKnewSafe'],
      hypotheses:[
        {id:'knew',text:'Марина знала о семейном сейфе задолго до вечера'},
        {id:'guess',text:'Марина впервые узнала о сейфе в день исчезновения',showAny:['t:marina:knowledge']},
        {id:'never',text:'Марина действительно никогда не знала о сейфе',showAny:['t:marina:knowledge']}
      ],
      routes:[{hypothesis:'knew',deductionId:'marinaKnewSafe',requires:['t:marina:knowledge','e:oldPhoto']}]
    },
    {
      id:'marinaAccess', group:'main', number:6,
      title:'Могла ли Марина самостоятельно открыть сейф?',
      prompt:'Установите не только знание о сейфе, но и реальную возможность получить к нему доступ.',
      unlockAny:['d:marinaKnewSafe','t:marina:code','e:familyCode','e:safe'], solvedBy:['d:marinaAccess'],
      hypotheses:[
        {id:'access',text:'Марина могла открыть сейф семейным кодом'},
        {id:'viktorOnly',text:'Открыть сейф мог только Виктор',showAny:['e:safe']},
        {id:'forced',text:'Сейф был вскрыт силой',showAny:['e:safe']}
      ],
      routes:[
        {hypothesis:'access',deductionId:'marinaAccessArchive',requires:['d:marinaKnewSafe','e:familyCode','e:safe']},
        {hypothesis:'access',deductionId:'marinaAccessDialogue',requires:['t:marina:code','e:familyCode','e:safe']}
      ]
    },
    {
      id:'marinaMovement', group:'main', number:7,
      title:'Перемещала ли Марина книгу после Виктора?',
      prompt:'Проверьте второй этап исчезновения. Здесь также существует несколько независимых путей доказательства.',
      unlockAny:['d:marinaAccess','e:cameraMarina','e:linenNapkin','t:anton:napkin','t:liza:marina'], solvedBy:['d:marinaMovedBook'],
      hypotheses:[
        {id:'moved',text:'Марина забрала книгу из сейфа и перенесла ее через служебную часть'},
        {id:'stayed',text:'После Виктора книга все время оставалась в сейфе',showAny:['e:safe','d:marinaAccess']},
        {id:'liza',text:'Книгу из сейфа забрала Лиза',showAny:['e:staffSchedule','t:liza:scheduleLie','t:liza:afterTruth','t:liza:payment','e:lizaPayment']},
        {id:'anton',text:'Книгу из сейфа забрал Антон',showAny:['t:anton:after','t:anton:napkin']}
      ],
      routes:[
        {hypothesis:'moved',deductionId:'marinaMovedCamera',requires:['d:marinaAccess','e:cameraMarina']},
        {hypothesis:'moved',deductionId:'marinaMovedKitchen',requires:['d:marinaAccess','e:linenNapkin','t:anton:napkin']},
        {hypothesis:'moved',deductionId:'marinaMovedWitness',requires:['d:marinaAccess','e:linenNapkin','t:liza:marina']}
      ]
    },
    {
      id:'twoStages', group:'main', number:8,
      title:'Как выглядела полная последовательность исчезновения?',
      prompt:'Книга уже найдена. Теперь соедините два доказанных этапа в единую хронологию.',
      unlockAll:['d:viktorHidBook','d:marinaMovedBook','e:foundBook'], solvedBy:['d:twoStages'],
      hypotheses:[
        {id:'two',text:'Исчезновение состояло из двух отдельных действий Виктора и Марины'},
        {id:'viktor',text:'Все исчезновение от начала до конца организовал только Виктор',showAny:['d:viktorHidBook']},
        {id:'marina',text:'Марина забрала книгу еще до действий Виктора',showAny:['d:marinaMovedBook','e:cameraMarina']},
        {id:'staff',text:'Книгу совместно похитили сотрудники ресторана',showAny:['e:staffSchedule','t:liza:afterTruth','t:anton:after']}
      ],
      routes:[{hypothesis:'two',deductionId:'twoStages',requires:['d:viktorHidBook','d:marinaMovedBook']}]
    },
    {
      id:'pavelLiza', group:'optional', number:9,
      title:'Что скрывали Павел и Лиза?',
      prompt:'Проверьте, относится ли их тайная договоренность к исчезновению всей книги.',
      unlockAny:['e:lizaPayment','t:liza:payment','e:recipePhotos'], solvedBy:['d:pavelLizaDeal'],
      hypotheses:[
        {id:'photos',text:'Они скрывали передачу фотографий отдельных страниц'},
        {id:'book',text:'Лиза передала Павлу всю книгу',showAny:['e:lizaPayment','t:liza:payment']},
        {id:'nothing',text:'Между Павлом и Лизой не было тайной сделки',showAny:['t:pavel:payment','t:liza:payment']}
      ],
      routes:[{hypothesis:'photos',deductionId:'pavelLizaDeal',requires:['e:lizaPayment','t:liza:payment','e:recipePhotos']}]
    },
    {
      id:'antonCopy', group:'optional', number:10,
      title:'Связана ли копия Антона с нынешним исчезновением?',
      prompt:'Определите, является ли найденная копия новой зацепкой или старой историей.',
      unlockAny:['e:copiedRecipe','e:kitchenLog'], solvedBy:['d:antonOldCopy'],
      hypotheses:[
        {id:'old',text:'Копия существовала задолго до нынешнего исчезновения'},
        {id:'new',text:'Антон сделал копию в вечер исчезновения',showAny:['e:copiedRecipe']},
        {id:'theft',text:'Копия доказывает, что Антон похитил книгу',showAny:['e:copiedRecipe']}
      ],
      routes:[{hypothesis:'old',deductionId:'antonOldCopy',requires:['e:copiedRecipe','e:kitchenLog']}]
    },
    {
      id:'dmitryHistory', group:'optional', number:11,
      title:'Почему Дмитрий интересуется семейным архивом?',
      prompt:'Проверьте его рассказ о связи отца с семьей Орловых.',
      unlockAny:['e:archiveLetter','t:dmitry:father'], solvedBy:['d:dmitryHistory'],
      hypotheses:[
        {id:'history',text:'Интерес Дмитрия связан с историей его отца и архивом Орловых'},
        {id:'theft',text:'Дмитрий искал способ похитить книгу',showAny:['t:dmitry:interest','t:dmitry:father']},
        {id:'invented',text:'Дмитрий выдумал историю об отце',showAny:['t:dmitry:father']}
      ],
      routes:[{hypothesis:'history',deductionId:'dmitryHistory',requires:['e:archiveLetter','t:dmitry:father']}]
    }
  ];

  function investigationFactAvailable(key){
    if(key.startsWith('e:')) return state.evidence.includes(key.slice(2)) || state.statements.includes(key.slice(2));
    if(key.startsWith('d:')) return deductionSatisfied(key.slice(2));
    if(key.startsWith('t:')){
      const [,sid,tid]=key.split(':');
      return !!state.talks?.[sid]?.[tid];
    }
    return false;
  }

  function investigationQuestionSolved(q){
    return (q.solvedBy||[]).some(investigationFactAvailable);
  }

  function investigationQuestionAvailable(q){
    if((q.unlockAll||[]).length && !(q.unlockAll||[]).every(investigationFactAvailable)) return false;
    const routeFacts=[...new Set((q.routes||[]).flatMap(r=>r.requires||[]))];
    const availableRouteFacts=routeFacts.filter(investigationFactAvailable).length;
    const minFacts=q.minFactsToOpen ?? Math.min(2, routeFacts.length || 1);
    if(routeFacts.length && availableRouteFacts < minFacts) return false;
    if((q.unlockAny||[]).length && !(q.unlockAny||[]).some(investigationFactAvailable) && !availableRouteFacts) return false;
    return true;
  }

  function investigationHypothesisVisible(q,h){
    if((h.showAll||[]).length && !(h.showAll||[]).every(investigationFactAvailable)) return false;
    if((h.showAny||[]).length) return (h.showAny||[]).some(investigationFactAvailable);
    const routes=(q.routes||[]).filter(r=>r.hypothesis===h.id);
    if(routes.length){
      return routes.some(r=>{
        const req=r.requires||[];
        const have=req.filter(investigationFactAvailable).length;
        const need=h.minFactsToShow ?? Math.min(2, req.length || 1);
        return have>=need;
      });
    }
    return true;
  }

  function investigationQuestionReady(q){
    if(investigationQuestionSolved(q) || !investigationQuestionAvailable(q)) return false;
    return (q.routes||[]).some(r=>(r.requires||[]).every(investigationFactAvailable));
  }

  // Перед финальной версией игрок обязан проверить алиби каждого персонажа.
  // Итог алиби может быть любым: подтверждено, частично, опровергнуто или отсутствует.
  // Важно, чтобы ячейка была именно проверена, а не оставалась в состоянии
  // «Можно попытаться проверить» / «Нет материалов». Остальные критерии Матрицы
  // помогают расследованию, но сами по себе финал не блокируют.
  const matrixAlibiChecks=[
    'viktor:alibi','marina:alibi','pavel:alibi',
    'liza:alibi','anton:alibi','dmitry:alibi'
  ];

  // Требования маршрутов продублированы здесь в компактном виде для счетчика
  // на нижней кнопке «Расследование». Счетчик будет показывать только алиби,
  // которые уже можно проверить, но игрок еще не проверил.
  const matrixCheckRoutes={
    'viktor:motive':[['e:insurance','e:financialDoc']],
    'viktor:access':[['e:safe'],['t:viktor:safeAdmission']],
    'viktor:opportunity':[['e:dustMark','t:dmitry:desk'],['d:bookOnDesk','e:camera'],['d:bookOnDesk','e:camera','e:safe']],
    'viktor:alibi':[['e:camera']],
    'marina:motive':[['t:marina:family','e:archiveOwnership']],
    'marina:access':[['d:marinaKnewSafe','e:familyCode','e:safe'],['t:marina:code','e:familyCode','e:safe']],
    'marina:opportunity':[['d:marinaAccess','e:cameraMarina'],['d:marinaAccess','e:linenNapkin','t:anton:napkin']],
    'marina:alibi':[['e:hallPhoto','e:cameraMarina']],
    'pavel:motive':[['e:lizaPayment','t:liza:payment','e:recipePhotos']],
    'pavel:opportunity':[['e:hallPhoto','t:pavel:alibi']],
    'pavel:alibi':[['e:hallPhoto','t:pavel:alibi']],
    'liza:motive':[['e:lizaPayment','t:liza:payment','e:recipePhotos']],
    'liza:opportunity':[['e:staffSchedule','t:liza:afterTruth']],
    'liza:alibi':[['e:lizaExit','t:liza:afterTruth']],
    'anton:motive':[['e:copiedRecipe','e:kitchenLog']],
    'anton:opportunity':[['e:breakerLog','t:anton:blackout']],
    'anton:alibi':[['e:kitchenOrders','e:breakerLog']],
    'dmitry:motive':[['t:dmitry:father','e:archiveLetter']],
    'dmitry:access':[['t:dmitry:selfArchive']],
    'dmitry:alibi':[['e:dmitryRecorder','e:hallPhoto']]
  };

  function matrixAllAlibisResolved(){
    const results=state?.suspectMatrixResults||{};
    return matrixAlibiChecks.every(key=>!!results[key]);
  }

  function matrixResolvedAlibiCount(){
    const results=state?.suspectMatrixResults||{};
    return matrixAlibiChecks.filter(key=>!!results[key]).length;
  }

  function matrixPendingAlibiCount(){
    const results=state?.suspectMatrixResults||{};
    return matrixAlibiChecks.filter(key=>{
      if(results[key]) return false;
      return (matrixCheckRoutes[key]||[]).some(req=>req.every(investigationFactAvailable));
    }).length;
  }

  function matrixUnresolvedAlibiCount(){
    const results=state?.suspectMatrixResults||{};
    return matrixAlibiChecks.filter(key=>!results[key]).length;
  }

  function updateInvestigationDock(){
    const btn=document.querySelector('[data-panel="case"]');
    if(!btn) return;
    const ready=matrixPendingAlibiCount();
    btn.classList.toggle('investigation-ready',ready>0);
    let badge=btn.querySelector('.investigation-dock-badge');
    if(!badge){
      badge=document.createElement('b');
      badge.className='investigation-dock-badge';
      btn.appendChild(badge);
    }
    badge.textContent=ready>0?String(ready):'';
    badge.classList.toggle('hidden',ready===0);
    btn.title=ready>0?`Готовы к проверке алиби: ${ready}`:'Расследование';
  }

  const suspects = {
    viktor:{name:'Виктор Орлов', role:'владелец ресторана', img:'assets/characters/viktor.png', mood:'Сдержан', status:'Подозреваемый', loc:'office', topics:[
      {id:'book',label:'Книга после демонстрации',text:'«После демонстрации я собирался вернуть книгу в витрину. Было много гостей и дел, я мог ненадолго оставить ее на столе».',statement:true,mode:'witness'},
      {id:'whyLie',label:'Почему вы сказали, что сразу вернули книгу?',requires:['d:bookOnDesk'],text:'«Хорошо. Я не вернул ее сразу. Книга действительно какое-то время лежала на столе. Я не хотел превращать это в отдельную историю».',statement:true,mode:'witness'},
      {id:'insurance',label:'Зачем книга была застрахована на большую сумму?',needs:'insurance',text:'«Это ценная вещь. Я пересмотрел страховку, потому что ресторан переживает непростой период и я хотел защитить активы».',mode:'context'},
      {id:'money',label:'Финансовое положение ресторана',needs:'financialDoc',text:'«Да, у ресторана были кассовые проблемы. Но финансовые трудности сами по себе не доказывают, что я собирался терять книгу».',statement:true,mode:'witness'},
      {id:'before2026',label:'Что вы делали перед 20:26?',needs:'camera',text:'«Я вышел с рабочей папкой. Книги в ней не было — это видно хотя бы по размеру. Книга осталась в кабинете».',statement:true,mode:'witness'},
      {id:'safeAdmission',label:'Вы спрятали книгу в сейфе?',requires:['d:viktorHidBook'],text:'«Да. Я убрал книгу в сейф. Я не выносил ее из кабинета. Я хотел, чтобы все решили, будто она исчезла после демонстрации».',statement:true,mode:'witness'}
    ]},
    marina:{name:'Марина Орлова', role:'сестра Виктора', img:'assets/characters/marina.png', mood:'Спокойна', status:'Подозреваемая', loc:'office', topics:[
      {id:'where',label:'Где вы были после отключения света?',text:'«Не все время в зале. Я проходила через служебную часть ресторана».',statement:true,mode:'witness'},
      {id:'family',label:'Что для вас значит семейная книга?',text:'«Это не актив Виктора. Это история нашей семьи. Я не хотела, чтобы он распоряжался ею как личной собственностью».',statement:true,mode:'witness'},
      {id:'knowledge',label:'Вы знали о сейфе в кабинете Виктора?',needs:'safe',text:'«Нет. О сейфе в кабинете Виктора я не знала. Я давно не вмешиваюсь в его личные дела».',statement:true,mode:'witness'},
      {id:'photoProof',label:'На этой фотографии вы стоите у сейфа. Как вы это объясните?',needs:'oldPhoto',unlockTopic:'knowledge',text:'«Да, это я. Фотография очень старая. Отец когда-то показывал нам семейный сейф, но я не знала, что Виктор до сих пор пользуется именно им».',statement:true,mode:'witness'},
      {id:'code',label:'Вы знали семейный код?',needs:'familyCode',unlockTopic:'photoProof',text:'«Да. Старый семейный код я знала. Я не была уверена, что Виктор его не сменил».',statement:true,mode:'witness'},
      {id:'napkin',label:'Зачем вам понадобилась льняная салфетка?',needs:'linenNapkin',text:'«Я попросила ее у Антона. Сказала, что пролила вино. Это было не совсем правдой».',statement:true,mode:'witness'},
      {id:'bundle',label:'Почему камера фиксирует вас со свертком?',needs:'cameraMarina',text:'«Я не хочу отвечать, пока вы строите вывод только по силуэту на камере».',statement:true,mode:'witness'},
      {id:'archive',label:'Почему книга оказалась в семейном архиве?',needs:'foundBook',text:'«Я забрала ее из сейфа и отнесла в архив. Я считала, что спасаю семейную реликвию от того, что делал Виктор».',statement:true,mode:'witness'}
    ]},
    anton:{name:'Антон Савельев', role:'шеф-повар', img:'assets/characters/anton.png', mood:'Раздражен', status:'Подозреваемый', loc:'kitchen', topics:[
      {id:'copy',label:'Зачем вам копия рецепта?',needs:'copiedRecipe',text:'«Это старая рабочая копия. Я сделал ее, чтобы не бегать к семейной книге во время работы».',statement:true,mode:'witness'},
      {id:'copyAge',label:'Когда была сделана эта копия?',needs:'kitchenLog',text:'«Несколько лет назад. Журнал кухни должен это подтвердить».',statement:true,mode:'witness'},
      {id:'blackout',label:'Почему погас свет?',needs:'breakerLog',text:'«Сработал автомат. На кухне одновременно включили слишком много оборудования. Никакого саботажа».',statement:true,mode:'witness'},
      {id:'after',label:'Кто заходил на кухню после отключения?',requires:['e:breakerLog'],text:'«После того как свет вернулся, сюда заходила Марина. Она явно торопилась».',statement:true,mode:'witness'},
      {id:'napkin',label:'Что Марина взяла на кухне?',needs:'linenNapkin',text:'«Большую льняную салфетку. Сказала, что пролила вино, но выглядела так, будто ей нужно было что-то завернуть».',statement:true,mode:'witness'}
    ]},
    pavel:{name:'Павел Зорин', role:'владелец конкурирующего ресторана', img:'assets/characters/pavel.png', mood:'Уверен', status:'Подозреваемый', loc:'hall', topics:[
      {id:'interest',label:'Почему вы интересуетесь книгой?',text:'«Я конкурент Виктора. Конечно, меня интересуют его рецепты. Но одна вещь — интерес, другая — украсть семейную реликвию».',statement:true,mode:'witness'},
      {id:'payment',label:'Зачем вы переводили деньги Лизе?',needs:'lizaPayment',text:'«За фотографии нескольких страниц. Я хотел сравнить рецептуры. Саму книгу я не заказывал».',statement:true,mode:'witness'},
      {id:'photos',label:'Что именно вы просили сфотографировать?',needs:'recipePhotos',text:'«Несколько страниц. Именно те, что лежат в конверте. Больше мне ничего не передавали».',statement:true,mode:'witness'},
      {id:'alibi',label:'Почему вас нет на снимке в 20:33?',needs:'hallPhoto',text:'«Я выходил на улицу покурить. Ненадолго — всего на несколько минут. Поэтому на снимке тоста меня нет. Потом я вернулся в зал».',statement:true,mode:'witness'}
    ]},
    liza:{name:'Лиза Коваль', role:'официантка', img:'assets/characters/liza.png', mood:'Нервничает', status:'Свидетель', loc:'corridor', topics:[
      {id:'before',label:'Что вы видели перед отключением?',unlockTopic:'scheduleLie',text:'«Виктор вышел из кабинета с обычной папкой. Книга туда явно не помещалась».',statement:true,mode:'witness'},
      {id:'after',label:'Вы работали в день исчезновения книги?',text:'«Нет. У меня был выходной. В ресторане меня в тот день вообще не было. О том, что произошло, я узнала уже потом от коллег».',statement:true,mode:'witness',openLocation:'staff'},
      {id:'scheduleLie',label:'На доске смен указана ваша вечерняя смена. Почему вы сказали, что не работали?',needs:'staffSchedule',unlockTopic:'after',text:'«Ладно. Я была здесь. Но к книге это никакого отношения не имеет».',statement:true,mode:'witness'},
      {id:'afterTruth',label:'Почему вы скрыли, что были в ресторане?',unlockTopic:'scheduleLie',text:'«Я ушла со смены раньше без разрешения. Уже после того, как свет включили, зашла в комнату персонала, забрала вещи и ушла через служебный выход. Если бы Виктор узнал, у меня были бы проблемы».',statement:true,mode:'witness'},
      {id:'payment',label:'Откуда перевод?',needs:'lizaPayment',text:'«Павел платил мне за фотографии отдельных страниц. Я понимаю, как это выглядит, но книгу я не брала».',statement:true,mode:'witness'},
      {id:'cellar',label:'Что лежит в конверте в винном погребе?',needs:'cellarNote',text:'«Распечатки фотографий страниц. Я оставила конверт в погребе для Павла».',statement:true,mode:'witness',openLocation:'cellar'},
      {id:'marina',label:'Видели ли вы Марину в служебной части?',needs:'cameraMarina',unlockTopic:'scheduleLie',text:'«Да. Я видела ее после отключения света. Она шла быстро и держала что-то завернутое».',statement:true,mode:'witness'}
    ]},
    dmitry:{name:'Дмитрий Лебедев', role:'журналист', img:'assets/characters/dmitry.png', mood:'Наблюдателен', status:'Свидетель', loc:'hall', topics:[
      {id:'desk',label:'Что произошло после демонстрации?',text:'«После демонстрации Виктор положил книгу на письменный стол в кабинете. В витрину он ее сразу не вернул».',statement:true,mode:'witness'},
      {id:'interest',label:'Почему вас интересует эта книга?',unlockTopic:'desk',text:'«В ней не только рецепты, но и история ресторана. Меня интересовала именно семейная хроника».',statement:true,mode:'witness'},
      {id:'father',label:'Что связывало вашего отца с Орловыми?',unlockTopic:'interest',text:'«Отец помогал Орловым собирать семейную историю и разбирать старые документы».',statement:true,mode:'witness'},
      {id:'archiveAccess',label:'У вашего отца был доступ в семейный архив?',unlockTopic:'father',text:'«Да. Несколько лет он помогал Орловым разбирать семейные записи, и Виктор-старший разрешал ему работать в архиве».',statement:true,mode:'witness',openLocation:'archive'},
      {id:'selfArchive',label:'Вы сами бывали в семейном архиве?',unlockTopic:'archiveAccess',text:'«Один раз, много лет назад, вместе с отцом. После его смерти я туда не заходил».',statement:true,mode:'witness'},
      {id:'observed',label:'Что вы заметили в отношениях Марины и Виктора?',unlockTopic:'selfArchive',text:'«Они спорили о книге как о семейной собственности. Марина считала, что Виктор обращается с ней как с финансовым активом».',statement:true,mode:'witness'}
    ]}

  };

  const notebookObservationDefs = [
    {
      id:'verify-dmitry-desk',
      trigger:'topic:dmitry:desk',
      text:'Необходимо подтвердить или опровергнуть показания Лебедева, что книга оставалась на столе Виктора после демонстрации.',
      isDone:()=>deductionSatisfied('bookOnDesk')
    },
    {
      id:'inspect-family-archive',
      trigger:'topic:dmitry:archiveAccess',
      text:'Необходимо осмотреть архив. Может удастся что-то найти.',
      isDone:()=>['archiveLetter','oldPhoto','familyCode','archiveOwnership','foundBook'].some(id=>state.evidence.includes(id))
    },
    {
      id:'viktor-financial-motive',
      evidence:'financialDoc',
      text:'Имел ли Виктор мотив инсценировать кражу книги из-за финансовых проблем.',
      isDone:()=>deductionSatisfied('viktorFinancialMotive')
    },
    {
      id:'verify-marina-testimony',
      trigger:'topic:marina:where',
      text:'Нужно подтвердить или опровергнуть показания Марины.',
      isDone:()=>state.evidence.includes('cameraMarina')
    },
    {
      id:'camera-blackout-sequence',
      evidence:'camera',
      text:'Следует подтвердить или опровергнуть последовательность событий: отключение света и выход Виктора из кабинета.',
      isDone:()=>state.evidence.includes('breakerLog') && state.evidence.includes('camera')
    },
    {
      id:'verify-pavel-absence',
      evidence:'hallPhoto',
      text:'Необходимо выяснить, где находился Павел Зорин в 20:33: на снимке юбилейного тоста его нет.',
      isDone:()=>!!state.talks?.pavel?.alibi
    },
    {
      id:'verify-liza-shift',
      trigger:'topic:liza:after',
      text:'Проверить, действительно ли Лиза не работала в день исчезновения книги.',
      isDone:()=>state.evidence.includes('staffSchedule')
    }
  ];

  const detectiveInsightDefs = {
    'topic:dmitry:desk': {
      mood:'thoughtful',
      title:'Книга осталась в кабинете',
      text:'Значит, после демонстрации книга не вернулась в витрину и еще оставалась в кабинете. Если версия верна, где-то должен найтись материальный след этого короткого промежутка. Стоит внимательно осмотреть кабинет и выслушать самого Виктора.'
    },
    'topic:liza:before': {
      mood:'alert',
      title:'Папка — не книга',
      text:'Если Виктор вышел лишь с обычной папкой, то в 20:26 он не выносил семейную книгу. Похоже, разгадку нужно искать не снаружи, а внутри кабинета — в том, что осталось там после демонстрации.'
    },
    'topic:anton:blackout': {
      mood:'thoughtful',
      title:'Отключение света могло быть случайным',
      text:'Можно ли подтвердить показание Антона о том, что причиной отключения стала перегрузка электросети. Нужно найти журнал контроля. Возможно, темнота была лишь случайным обстоятельством, которым кто-то воспользовался.'
    },
    'topic:liza:after': {
      mood:'curious',
      title:'Алиби Лизы нужно проверить',
      text:'Если Лиза действительно не работала в день исчезновения книги, ее можно исключить из числа тех, кто находился в ресторане. Но это легко проверить по расписанию персонала. Стоит осмотреть доску смен в комнате персонала.'
    },
    'topic:liza:scheduleLie': {
      mood:'alert',
      title:'Лиза солгала о своем присутствии',
      text:'Доска смен опровергла первоначальные слова Лизы. Она действительно находилась в ресторане в день исчезновения книги и сознательно это скрыла. Теперь у нее нужно выяснить причину лжи и ее перемещения после восстановления света.'
    },
    'topic:liza:afterTruth': {
      mood:'skeptical',
      title:'Причина лжи еще не оправдание',
      text:'Лиза объясняет ложь страхом наказания за самовольный уход со смены. Это возможно, но сам факт лжи делает ее полноценной подозреваемой: она была в ресторане и перемещалась по служебной части в нужный промежуток времени.'
    },
    'topic:dmitry:archiveAccess': {
      mood:'insight',
      title:'След ведет в семейный архив',
      text:'Значит, отец Дмитрия действительно работал в семейном архиве. Если там сохранились его записи или письма, они могут объяснить интерес Дмитрия к книге. Стоит проверить архив.'
    },
    'topic:marina:family': {
      mood:'thoughtful',
      title:'Книга для Марины',
      text:'Значит для Марины книга имела не просто как инструмент в бизнесе. Она к ней очень трепетно относилась.'
    },
    'topic:marina:where': {
      mood:'alert',
      title:'Показания Марины требуют проверки',
      text:'Если в ресторане имеются видеокамеры, значит, надо поискать доказательства утверждения Марины.'
    },
    'topic:marina:photoProof': {
      mood:'alert',
      title:'Марина все-таки знала о сейфе',
      text:'Фотография заставила Марину изменить первоначальный ответ. Значит, ее отрицание было неточным. Теперь важно понять, знала ли она только о существовании сейфа или действительно могла его открыть.'
    },
    'topic:pavel:alibi': {
      mood:'skeptical',
      title:'Павел объяснил отсутствие',
      text:'Павел утверждает, что в 20:33 выходил на улицу покурить. Это объясняет, почему его нет на снимке, но пока остается только его словами. Важно не превращать отсутствие на фотографии в доказательство причастности без дополнительных фактов.'
    },
    'topic:pavel:payment': {
      mood:'skeptical',
      title:'Не всякая тайна — главная',
      text:'Павел явно скрывает неприятную историю с фотографиями страниц. Но одно дело — тайная сделка, и совсем другое — исчезновение всей книги. Важно не перепутать побочную линию с основной цепочкой.'
    },
    'topic:marina:code': {
      mood:'alert',
      title:'У Марины был доступ',
      text:'Марина знала семейный код. Значит, возможность открыть сейф у нее действительно была. Теперь остается понять, воспользовалась ли она этой возможностью и что сделала потом.'
    },
    'topic:anton:napkin': {
      mood:'curious',
      title:'Сверток становится реальнее',
      text:'В комплекте не хватает большой льняной салфетки. Возможно, в нее что-то заворачивали, это может объяснить появление свертка в комнате персонала. Интересно, имеется ли последовательность событий между тем фактом, что Марина имела доступ к сейфу, недостающей льняной салфеткой и показаниями Антона по поводу салфетки.'
    },
    'topic:liza:marina': {
      mood:'insight',
      title:'Марина и служебный коридор',
      text:'Теперь стоит задуматься о последовательности событий между тем фактом, что Марина имела доступ к сейфу и кадром с камеры, сделанным в 20:34. Если к этому добавить еще одно независимое подтверждение, второй этап исчезновения станет намного отчетливее. Например, сравнить последовательность между тем фактом, что Марина имела доступ к сейфу и брала на кухне салфетку согласно показаниям Антона.'
    },
    'topic:viktor:safeAdmission': {
      mood:'thoughtful',
      title:'Первый этап почти прояснился',
      text:'Виктор признал, что сам спрятал книгу в сейфе. Но признание — еще не вся история. Нужно отделить его действия от того, что произошло с книгой потом.'
    },
    'topic:marina:archive': {
      mood:'insight',
      title:'Книга найдена',
      text:'Теперь ясно, где оказалась книга. Но место находки — лишь конец пути. Чтобы картина стала полной, нужно связать последовательность двух событий: Виктор первым спрятал книгу в сейфе, но Марина переместила книгу.'
    },
    'evidence:oldPhoto': {
      mood:'alert',
      title:'Фотография противоречит словам Марины',
      text:'На старой фотографии Марина стоит рядом с семейным сейфом. Ее слова о том, что она не знала о сейфе, теперь требуют объяснения. Следует установить противоречие между этими фактами и допросить ее по этому поводу и узнать, почему она скрыла этот факт.'
    },
    'evidence:familyCode': {
      mood:'insight',
      title:'Семейный код',
      text:'Семейный код! Имела ли Марина доступ к коду от сейфа и возможность открыть его, воспользовавшись эти кодом?'
    }
  };

  const keyChainBySuspect = {};
  const suspectEvidenceMap = {
    viktor:['dustMark','safe','insurance','financialDoc','camera'],
    marina:['safe','oldPhoto','familyCode','linenNapkin','cameraMarina','archiveOwnership','foundBook'],
    anton:['copiedRecipe','kitchenLog','kitchenOrders','breakerLog','linenNapkin'],
    pavel:['lizaPayment','recipePhotos','hallPhoto'],
    liza:['camera','lizaPayment','staffSchedule','lizaExit','recipePhotos','cameraMarina'],
    dmitry:['dustMark','archiveLetter','hallPhoto','dmitryRecorder']
  };

  const sceneCast = {
    hall:[],
    office:[],
    kitchen:[],
    corridor:[],
    staff:[]
  };

  const occlusionDefs = {};

  const characterHighlightDefs = {};


  const hotspotDefs = {
    hall:[
      {id:'hall-to-corridor',x:6.3,y:6.5,w:6.8,h:41.5,label:'Служебный коридор',action:'go',target:'corridor'},
      {id:'talk-pavel',x:52.2,y:28.0,w:12.8,h:58.0,label:'Павел Зорин',action:'interrogate',suspect:'pavel'},
      {id:'talk-dmitry',x:70.2,y:34.0,w:17.4,h:61.0,label:'Дмитрий Лебедев',action:'interrogate',suspect:'dmitry'},
      {id:'dmitry-recorder',x:26.7,y:69.2,w:5.0,h:4.8,label:'Диктофон на столе',action:'evidence',evidence:'dmitryRecorder'},
      {id:'hall-photo',x:38.3,y:22.6,w:7.8,h:6.2,label:'Фотография юбилейного тоста',action:'evidence',evidence:'hallPhoto'}
    ],
    office:[
      {id:'office-to-corridor',x:1.5,y:3.5,w:14.5,h:45.0,label:'Служебный коридор',action:'go',target:'corridor'},
      {id:'office-to-archive',x:37.5,y:6.0,w:15.5,h:47.5,label:'Семейный архив',action:'go',target:'archive'},
      {id:'case',x:75.0,y:31.0,w:22.0,h:24.0,label:'Осмотреть витрину',action:'evidence',evidence:'emptyCase'},
      {id:'desk',x:31.5,y:52.0,w:8.5,h:11.0,label:'Осмотреть письменный стол',action:'evidence',evidence:'dustMark',requires:['t:dmitry:desk']},
      {id:'talk-viktor',x:16.0,y:29.0,w:15.0,h:64.0,label:'Виктор Орлов',action:'interrogate',suspect:'viktor'},
      {id:'insurance',x:43.0,y:53.0,w:8.0,h:9.0,label:'Страховой полис',action:'evidence',evidence:'insurance'},
      {id:'financial',x:48.0,y:54.0,w:8.0,h:9.0,label:'Финансовые документы',action:'evidence',evidence:'financialDoc'},
      {id:'safe',x:61.2,y:15.0,w:5.5,h:19.0,label:'Осмотреть сейф',action:'evidence',evidence:'safe',requires:['d:bookOnDesk']},
      {id:'talk-marina',x:68.0,y:20.0,w:10.5,h:70.0,label:'Марина Орлова',action:'interrogate',suspect:'marina'}
    ],
    kitchen:[
      {id:'kitchen-to-corridor',x:13.7,y:13.9,w:10.2,h:45.8,label:'Служебный коридор',action:'go',target:'corridor'},
      {id:'breaker',x:87.0,y:12.0,w:9.0,h:14.0,label:'Журнал электрощита',action:'evidence',evidence:'breakerLog'},
      {id:'kitchen-log',x:91.0,y:29.0,w:7.0,h:12.0,label:'Старый журнал кухни',action:'evidence',evidence:'kitchenLog'},
      {id:'kitchen-orders',x:73.0,y:46.0,w:5.8,h:12.5,label:'Мусорное ведро',action:'evidence',evidence:'kitchenOrders'},
      {id:'recipe-copy',x:27.5,y:25.0,w:5.0,h:13.0,label:'Рабочие записи',action:'evidence',evidence:'copiedRecipe'},
      {id:'napkin',x:10.0,y:58.0,w:10.0,h:12.0,label:'Комплект льняных салфеток',action:'evidence',evidence:'linenNapkin'},
      {id:'staff-key',x:52.0,y:54.0,w:8.0,h:10.0,label:'Служебная связка ключей',action:'evidence',evidence:'staffKey'},
      {id:'talk-anton',x:36.0,y:18.0,w:14.0,h:62.0,label:'Антон Савельев',action:'interrogate',suspect:'anton'}
    ],
    corridor:[
      {id:'corridor-to-hall',x:1.0,y:5.5,w:16.0,h:77.0,label:'Главный зал',action:'go',target:'hall'},
      {id:'corridor-to-staff',x:84.7,y:13.3,w:12.2,h:75.0,label:'Комната персонала',action:'go',target:'staff'},
      {id:'corridor-to-kitchen',x:35.6,y:26.3,w:7.4,h:27.5,label:'Кухня',action:'go',target:'kitchen'},
      {id:'corridor-to-cellar',x:70.0,y:13.5,w:11.2,h:69.0,label:'Винный погреб',action:'go',target:'cellar'},
      {id:'corridor-to-office',x:56.6,y:20.2,w:3.0,h:46.0,label:'Кабинет Виктора',action:'go',target:'office'},
      {id:'camera',x:29.8,y:11.8,w:5.6,h:9.2,label:'Запись камеры 20:26',action:'evidence',evidence:'camera',markerX:32.5,markerY:16.5},
      {id:'camera-marina',x:29.8,y:11.8,w:5.6,h:9.2,label:'Запись камеры 20:34',action:'evidence',evidence:'cameraMarina',markerX:32.5,markerY:16.5},
      {id:'camera-liza-exit',x:88.0,y:1.8,w:9.0,h:11.8,label:'Камера над входом в кухню',action:'evidence',evidence:'lizaExit',requires:['t:liza:afterTruth'],markerX:92.5,markerY:8.5},
      {id:'talk-liza',x:42.5,y:13.0,w:14.0,h:82.0,label:'Лиза Коваль',action:'interrogate',suspect:'liza'}
    ],
    staff:[
      {id:'staff-to-corridor',x:35.4,y:14.5,w:10.7,h:44.5,label:'Служебный коридор',action:'go',target:'corridor'},
      {id:'liza-bag',x:50.5,y:45.0,w:12.0,h:14.0,label:'Телефон Лизы',action:'evidence',evidence:'lizaPayment'},
      {id:'staff-board',x:49.0,y:14.0,w:17.0,h:27.0,label:'Доска смен',action:'evidence',evidence:'staffSchedule'},
      {id:'cellar-note',x:16.5,y:52.0,w:12.0,h:13.0,label:'Пометка в вещах Лизы',action:'evidence',evidence:'cellarNote'},
      {id:'archive-key',x:67.0,y:22.0,w:13.0,h:36.0,label:'Старый ключ с биркой',action:'evidence',evidence:'archiveKey'}
    ],
    cellar:[
      {id:'cellar-to-corridor',x:38.2,y:22.6,w:8.8,h:31.0,label:'Служебный коридор',action:'go',target:'corridor'},
      {id:'recipe-photos',x:70.0,y:40.0,w:10.5,h:13.0,label:'Конверт среди коробок',action:'evidence',evidence:'recipePhotos'}
    ],
    archive:[
      {id:'archive-to-office',x:56.8,y:12.0,w:14.0,h:59.0,label:'Кабинет Виктора',action:'go',target:'office'},
      {id:'photo',x:19.0,y:9.0,w:18.0,h:20.0,label:'Семейная фотография',action:'evidence',evidence:'oldPhoto',requires:['t:marina:knowledge']},
      {id:'code',x:8.5,y:50.5,w:23.0,h:15.0,label:'Запись о семейном коде',action:'evidence',evidence:'familyCode',requires:['t:marina:photoProof']},
      {id:'archive-letter',x:35.0,y:59.0,w:11.0,h:11.0,label:'Письмо отца Дмитрия',action:'evidence',evidence:'archiveLetter'},
      {id:'ownership',x:60.0,y:58.0,w:12.0,h:11.0,label:'Семейные документы',action:'evidence',evidence:'archiveOwnership'},
      {id:'book',x:72.0,y:35.0,w:12.0,h:16.0,label:'Осмотреть архивные короба',action:'evidence',evidence:'foundBook',requires:['d:viktorHidBook','d:marinaAccess','d:marinaMovedBook']}
    ]
  };

  // Собираемые предметы конкретной истории. Механика общая для всех дел;
  // здесь меняются только данные. Физические объекты добавляются сюда, когда
  // для них есть отдельный PNG-слой, не вшитый в фон локации.
  const collectibleDefs = {
  };

  const defaultState = {
    location:'hall',
    evidence:[],
    statements:[],
    notes:['Книга исчезла во время юбилейного ужина. Витрина оказалась заперта.'],
    talks:{},
    deductions:[],
    deductionAttempts:0,
    deductionHistory:[],
    interrogationProgress:{},
    activeInterrogationTopics:{},
    activeInterrogationEvidence:{},
    detectiveInsightsSeen:[],
    investigationTimelineOrder:[],
    suspectMatrixResults:{},
    suspectMatrixActiveCell:'',
    reconstructionSelections:{},
    reconstructionConfirmed:[],
    links:{motive:false,opportunity:false,contradiction:false},
    flags:{staffOpen:false,cellarOpen:false,archiveOpen:false,marinaContradiction:false,ending:false,prologueSeen:false},
    started:false
  };

  let state = migrateState(loadState());
  let currentSuspect = null;
  let currentStatement = null;
  let selectedStage3Proof = null;
  let currentTopic = null;
  let selectedInterrogationEvidence = null;
  let activeInterrogationChain = null;
  let deductionSessionFeedback = null;
  let caseModalOpen = false;
  let pendingDetectiveInsightKey = null;

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  function cloneDefault(){ return JSON.parse(JSON.stringify(defaultState)); }
  function loadState(){
    try{
      const saved=JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      const base=cloneDefault();
      return {
        ...base,
        ...saved,
        evidence:Array.isArray(saved.evidence)?saved.evidence:base.evidence,
        statements:Array.isArray(saved.statements)?saved.statements:base.statements,
        notes:Array.isArray(saved.notes)?saved.notes:base.notes,
        deductions:Array.isArray(saved.deductions)?saved.deductions:base.deductions,
        deductionHistory:Array.isArray(saved.deductionHistory)?saved.deductionHistory:base.deductionHistory,
        interrogationProgress:{...base.interrogationProgress,...(saved.interrogationProgress||{})},
        activeInterrogationTopics:{...base.activeInterrogationTopics,...(saved.activeInterrogationTopics||{})},
        activeInterrogationEvidence:{...base.activeInterrogationEvidence,...(saved.activeInterrogationEvidence||{})},
        detectiveInsightsSeen:Array.isArray(saved.detectiveInsightsSeen)?saved.detectiveInsightsSeen:base.detectiveInsightsSeen,
        investigationTimelineOrder:Array.isArray(saved.investigationTimelineOrder)?saved.investigationTimelineOrder:base.investigationTimelineOrder,
        suspectMatrixResults:(saved.suspectMatrixResults && typeof saved.suspectMatrixResults==='object')?saved.suspectMatrixResults:base.suspectMatrixResults,
        suspectMatrixActiveCell:typeof saved.suspectMatrixActiveCell==='string'?saved.suspectMatrixActiveCell:base.suspectMatrixActiveCell,
        reconstructionSelections:(saved.reconstructionSelections && typeof saved.reconstructionSelections==='object')?saved.reconstructionSelections:base.reconstructionSelections,
        reconstructionConfirmed:Array.isArray(saved.reconstructionConfirmed)?saved.reconstructionConfirmed:base.reconstructionConfirmed,
        talks:{...base.talks,...(saved.talks||{})},
        flags:{...base.flags,...(saved.flags||{})},
        links:{...base.links,...(saved.links||{})}
      };
    } catch { return cloneDefault(); }
  }
  function save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); if(typeof document!=='undefined') updateInvestigationDock(); }

  function migrateState(s){
    const stateCopy=s||cloneDefault();
    stateCopy.evidence ||= [];
    stateCopy.statements ||= [];
    stateCopy.deductions ||= [];
    stateCopy.deductionHistory ||= [];
    stateCopy.interrogationProgress ||= {};
    stateCopy.talks ||= {};
    stateCopy.detectiveInsightsSeen ||= [];
    stateCopy.suspectMatrixResults ||= {};
    stateCopy.suspectMatrixActiveCell ||= '';
    stateCopy.flags ||= {...cloneDefault().flags};

    // Repair saves created before the Matrix could form the first-stage Viktor conclusion.
    // If the old Matrix had already marked Viktor's opportunity as confirmed and all three
    // required facts are present, promote that progress to the canonical deduction so the
    // archive boxes become reachable without restarting the case.
    const viktorOpportunity=stateCopy.suspectMatrixResults?.['viktor:opportunity'];
    const hasViktorFirstStageFacts=(stateCopy.deductions||[]).includes('bookOnDesk')
      && (stateCopy.evidence||[]).includes('camera')
      && (stateCopy.evidence||[]).includes('safe');
    if(viktorOpportunity?.status==='yes' && hasViktorFirstStageFacts){
      if(!(stateCopy.deductions||[]).includes('viktorHidBookCamera')) stateCopy.deductions.push('viktorHidBookCamera');
      if(!(stateCopy.deductions||[]).includes('viktorHidBook')) stateCopy.deductions.push('viktorHidBook');
    }

    const obsoleteHallObservations=[
      'На снимке во время тоста на юбилейном вечере все присутствуют в зале, кроме Марины. На снимке имеется время 20:33.',
      'На снимке во время тоста на юбилейном вечере все присутствуют в зале, кроме Павла. На снимке имеется время 20:33.'
    ];
    stateCopy.notes=(stateCopy.notes||[]).filter(n=>!obsoleteHallObservations.includes(n));
    return stateCopy;
  }



  function factKeyEvidence(id){ return `e:${id}`; }
  function factKeyTalk(sid,tid){ return `t:${sid}:${tid}`; }
  function factKeyDeduction(id){ return `d:${id}`; }

  function getAvailableFacts(){
    const facts=[];

    const foundIds=getFoundEvidenceIds();
    // Key admissions are story-critical and should never be buried among many
    // ordinary interview answers. Put them first in the testimony list.
    const keyStatementOrder=['viktorAdmission','marinaSawSafe'];
    foundIds.sort((a,b)=>{
      const ai=keyStatementOrder.indexOf(a), bi=keyStatementOrder.indexOf(b);
      if(ai!==-1 || bi!==-1){
        if(ai===-1) return 1;
        if(bi===-1) return -1;
        return ai-bi;
      }
      return 0;
    });
    foundIds.forEach(id=>{
      const e=evidenceDefs[id];
      facts.push({
        key:factKeyEvidence(id),
        kind:state.statements.includes(id)&&!state.evidence.includes(id)?'Показание':'Улика',
        title:e.name,
        text:e.desc,
        icon:e.icon
      });
    });

    Object.entries(state.talks).forEach(([sid,topics])=>{
      Object.entries(topics||{}).forEach(([tid,data])=>{
        const topic=suspects[sid]?.topics.find(t=>t.id===tid);
        if(!topic) return;
        const factTitle=suspects[sid].name;
        facts.push({
          key:factKeyTalk(sid,tid),
          kind:'Показание',
          title:factTitle,
          text:data.text || topic.text,
          icon:'“'
        });
      });
    });

    (state.deductions||[]).forEach(id=>{
      const d=deductionDefs[id];
      if(!d) return;
      facts.push({
        key:factKeyDeduction(id),
        kind:'Вывод',
        title:d.name,
        text:d.desc,
        icon:d.icon
      });
    });

    return facts;
  }

  function sameFactSet(a,b){
    if(a.length!==b.length) return false;
    const aa=[...a].sort();
    const bb=[...b].sort();
    return aa.every((v,i)=>v===bb[i]);
  }

  const deductionRelationDefs = {
    confirmation:{
      label:'Подтверждение',
      short:'Подтверждение',
      explanation:'Показывает, что один материал независимо подтверждает другой.',
      example:'Например: Показание Персонажа 1 описывает определенный факт, а Улика 1 (или показание Персонажа 2) независимо подтверждает этот же факт.'
    },
    sequence:{
      label:'Последовательность событий',
      short:'Время',
      explanation:'Помогает определить, что произошло раньше, а что позже.',
      example:'Например: Улика 1 фиксирует одно событие в 20:10, а Показание Персонажа 1 описывает другое событие, произошедшее позже — в 20:20.'
    },
    contradiction:{
      label:'Противоречие',
      short:'Противоречие',
      explanation:'Показывает, что один материал не согласуется с другим.',
      example:'Например: Персонаж 1 утверждает, что не покидал помещение, а Улика 2 (или Персонаж 2) указывает на его присутствие в другом месте.'
    },
    opportunity:{
      label:'Возможность / доступ',
      short:'Доступ',
      explanation:'Помогает установить, мог ли персонаж попасть в нужное место, открыть что-либо или получить доступ к определенному объекту.',
      example:'Например: Улика 1 показывает, что Персонаж 1 знал код от помещения, а Улика 2 подтверждает, что этот код позволял получить туда доступ.'
    },
    motive:{
      label:'Мотив',
      short:'Мотив',
      explanation:'Помогает понять, зачем персонажу могло быть нужно совершить определенное действие.',
      example:'Например: Показание Персонажа 1 сообщает о его финансовых трудностях, а Улика 1 показывает, что определенное событие могло принести ему материальную выгоду.'
    },
  };

  function selectionSignature(selection,relation){
    return `${relation||'none'}::${[...selection].sort().join('|')}`;
  }

  function findDeductionForSelection(selection,relation){
    return Object.entries(deductionDefs).find(([id,d])=>
      !(state.deductions||[]).includes(id) &&
      d.relation===relation &&
      sameFactSet(selection,d.requires)
    );
  }

  function hasTestedDeduction(selection,relation){
    const sig=selectionSignature(selection,relation);
    return (state.deductionHistory||[]).some(h=>h.signature===sig);
  }

  function pushDeductionHistory(selection,relation,success,deductionId=null){
    state.deductionHistory ||= [];
    state.deductionHistory.push({
      signature:selectionSignature(selection,relation),
      keys:[...selection],
      relation,
      success:!!success,
      deductionId
    });
    if(state.deductionHistory.length>30) state.deductionHistory=state.deductionHistory.slice(-30);
  }

  function addDeduction(id){
    state.deductions ||= [];
    let changed=false;
    if(!state.deductions.includes(id)){
      state.deductions.push(id);
      changed=true;
    }
    const canonicalMap={
      viktorHidBookFinance:'viktorHidBook',
      viktorHidBookCamera:'viktorHidBook',
      marinaAccessArchive:'marinaAccess',
      marinaAccessDialogue:'marinaAccess',
      marinaMovedCamera:'marinaMovedBook',
      marinaMovedKitchen:'marinaMovedBook',
      marinaMovedWitness:'marinaMovedBook'
    };
    const canonical=canonicalMap[id];
    if(canonical && !state.deductions.includes(canonical)){
      state.deductions.push(canonical);
      changed=true;
    }
    if(changed){
      save();
      setObjective();
    }
    return changed;
  }

  function deductionSatisfied(id){
    return (state.deductions||[]).includes(id);
  }

  function deductionReadyForFinal(){
    return finalDeductionIds.every(id=>deductionSatisfied(id));
  }

  function getFoundEvidenceIds(){
    return Object.keys(evidenceDefs).filter(id=>state.evidence.includes(id)||state.statements.includes(id));
  }

  function getEvidenceUnlocks(id){
    const topics=[];
    Object.entries(suspects).forEach(([sid,s])=>{
      s.topics.forEach(t=>{
        if(t.needs===id) topics.push({suspectId:sid,suspect:s.name,topic:t.label});
      });
    });
    const locationsUnlocked=[];
    return {topics,locations:locationsUnlocked};
  }

  function currentObjectiveEvidenceId(){
    if(!state.evidence.includes('emptyCase')) return 'emptyCase';
    if(!state.evidence.includes('camera')) return 'camera';
    if(state.flags.archiveOpen && !state.evidence.includes('familyCode')) return 'familyCode';
    return null;
  }

  function evidenceStatusText(id){
    return state.evidence.includes(id)||state.statements.includes(id) ? 'Изучено' : 'Не найдено';
  }

  function showScreen(name){
    $$('.screen').forEach(el=>el.classList.remove('active'));
    $(name).classList.add('active');
  }

  function toast(msg){
    const el=$('#toast'); el.textContent=msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2200);
  }

  function setObjective(){
    const ds=state.deductions||[];
    const hasDmitryDesk=!!state.talks?.dmitry?.desk;
    const hasDust=state.evidence.includes('dustMark');
    let text='Начните с любой доступной ветки: кабинет Виктора, служебный коридор, кухня или разговоры в главном зале.';

    if(!ds.includes('bookOnDesk')){
      if(hasDmitryDesk && !hasDust){
        text='Дмитрий утверждает, что после демонстрации книга осталась на письменном столе. Проверьте, есть ли в кабинете Виктора следы, подтверждающие его слова.';
      } else if(!hasDmitryDesk && hasDust){
        text='На письменном столе обнаружен след книги. Расспросите Дмитрия о том, что он видел сразу после демонстрации.';
      } else if(hasDmitryDesk && hasDust){
        text='Показание Дмитрия подтверждается найденным следом. Откройте «Расследование», выберите вопрос о местонахождении книги после демонстрации и докажите подходящую версию найденными материалами.';
      } else {
        text='Установите, где находилась книга сразу после демонстрации. Осмотрите кабинет Виктора и расспросите Дмитрия.';
      }
    } else if(!ds.includes('viktorHidBook')){
      if(!state.evidence.includes('safe')){
        text='Книга оставалась в кабинете после демонстрации. Осмотрите кабинет Виктора внимательнее и проверьте, где ее могли спрятать.';
      } else {
        text='Восстановите первый этап исчезновения. Можно идти через финансовые документы Виктора или через камеру 20:26 и найденный сейф.';
      }
    } else if(!ds.includes('marinaAccess')){
      if(!state.talks?.marina?.knowledge){
        text='Теперь выясните, знала ли Марина о сейфе в кабинете Виктора.';
      } else if(!state.evidence.includes('oldPhoto')){
        text='Марина отрицает, что знала о сейфе. Найдите независимое подтверждение или опровержение ее слов. Семейный архив может оказаться полезен.';
      } else if(!state.talks?.marina?.photoProof){
        text='В архиве найдена старая фотография Марины у сейфа. Вернитесь к Марине и спросите, как она это объяснит.';
      } else if(!state.evidence.includes('familyCode')){
        text='Марина признала, что знала о семейном сейфе раньше. Осмотрите архив внимательнее: возможно, там сохранились сведения о доступе к нему.';
      } else if(!ds.includes('marinaKnewSafe')){
        text='Откройте «Расследование» и проверьте, говорит ли Марина правду о том, что не знала о сейфе.';
      } else {
        text='Установите, могла ли Марина самостоятельно открыть сейф. Используйте вывод о ее знании сейфа, запись о семейном коде и отсутствие следов взлома.';
      }
    } else if(!ds.includes('marinaMovedBook')){
      text='Проверьте, перемещала ли Марина книгу после действий Виктора. Это можно сделать через снимок камеры, сделанный в 20:34 или через кухню, салфетку и показания персонала.';
    } else if(!state.evidence.includes('foundBook') && locations.archive.open){
      text='Основная цепочка восстановлена. Осмотрите семейный архив еще раз. Теперь можно проверить, где оказалась книга.';
    } else if(!ds.includes('twoStages')){
      text='Откройте «Расследование» и восстановите полную последовательность исчезновения из двух уже доказанных этапов.';
    } else {
      text='Основная версия доказана. Можно предъявить финальную.';
    }
    $('#objectiveText').textContent=text;
  }

  function updateOpenLocations(){
    if(TEST_UNLOCK_ALL_LOCATIONS){
      Object.values(locations).forEach(location=>{ location.open = true; });
      return;
    }
    locations.staff.open = !!state.flags.staffOpen || state.evidence.includes('staffKey') || !!state.talks?.liza?.after;
    locations.cellar.open = !!state.flags.cellarOpen || state.evidence.includes('cellarNote') || !!state.talks?.liza?.cellar;
    locations.archive.open = !!state.flags.archiveOpen || state.evidence.includes('archiveKey') || !!state.talks?.dmitry?.archiveAccess;
  }

  function stateHasFact(key){
    if(!key) return true;
    if(key.startsWith('e:')){
      const id=key.slice(2);
      return state.evidence.includes(id) || state.statements.includes(id);
    }
    if(key.startsWith('d:')) return deductionSatisfied(key.slice(2));
    if(key.startsWith('t:')){
      const [,sid,tid]=key.split(':');
      return !!state.talks?.[sid]?.[tid];
    }
    if(key.startsWith('f:')) return !!state.flags?.[key.slice(2)];
    return false;
  }

  function isHotspotAvailable(h){
    if(h.needsDeduction && !(state.deductions||[]).includes(h.needsDeduction)) return false;
    if(h.requires && !h.requires.every(stateHasFact)) return false;
    if(h.hiddenAfter && h.hiddenAfter.some(stateHasFact)) return false;
    return true;
  }

  function renderCollectibles(){
    if(!window.DetectiveCollectibles) return;
    window.DetectiveCollectibles.render({
      host:'#sceneObjects',
      items:collectibleDefs[state.location]||[],
      isAvailable:item=>isHotspotAvailable(item),
      isCollected:item=>{
        const ids=item.grants||[item.evidence];
        return ids.filter(Boolean).every(id=>state.evidence.includes(id)||state.statements.includes(id));
      },
      onCollect:item=>{
        const ids=(item.grants||[item.evidence]).filter(Boolean);
        ids.forEach(id=>collectEvidence(id));
      }
    });
  }

  function renderScene(){
    updateOpenLocations();
    const loc=locations[state.location];
    const scene=$('#scene');
    scene.className='scene';
    scene.dataset.location=state.location;
    $('#locationTitle').textContent=loc.title;
    if($('#evidenceCount')) $('#evidenceCount').textContent=getFoundEvidenceIds().length;
    if($('#evidenceTotal')) $('#evidenceTotal').textContent=Object.keys(evidenceDefs).length;

    const sceneBg=$('#sceneBg');
    sceneBg.style.backgroundImage=`url('${loc.img}')`;
    renderCollectibles();

    const cast=$('#sceneCast');
    cast.innerHTML='';
    (sceneCast[state.location]||[]).forEach(c=>{
      const suspect=suspects[c.suspect];
      const btn=document.createElement('button');
      btn.className='scene-character';
      btn.style.left=c.x+'%';
      btn.style.bottom=(100-c.footY)+'%';
      btn.style.setProperty('--char-h',c.h+'%');
      btn.style.setProperty('--char-w',c.w+'%');
      btn.setAttribute('aria-label',suspect.name);
      btn.innerHTML=`<img src="${suspect.img}" alt="${suspect.name}"><span class="character-label">${suspect.name}</span>`;
      btn.addEventListener('click',()=>openInterrogation(c.suspect));
      cast.appendChild(btn);
    });

    const occ=$('#sceneOcclusion');
    const clip=occlusionDefs[state.location];
    occ.classList.toggle('active',!!clip);
    if(clip){
      occ.style.backgroundImage=`url('${loc.img}')`;
      occ.style.clipPath=clip;
      occ.style.webkitClipPath=clip;
    }else{
      occ.style.backgroundImage='none';
      occ.style.clipPath='none';
      occ.style.webkitClipPath='none';
    }

    const highlights=$('#characterHighlights');
    highlights.innerHTML='';

    const hs=$('#hotspots'); hs.innerHTML='';
    (hotspotDefs[state.location]||[]).filter(isHotspotAvailable).forEach(h=>{
      const btn=document.createElement('button');
      const classes=['hotspot'];
      if(h.action==='interrogate') classes.push('character-hotspot');
      if(h.id==='camera') classes.push('camera-hotspot');
      if(h.action==='evidence'){
        const found=state.evidence.includes(h.evidence)||state.statements.includes(h.evidence);
        classes.push('evidence-hotspot',found?'evidence-found':'evidence-new');
        btn.dataset.evidence=h.evidence;
        const marker=found?'✓':'◇';
        const label=found?`Изучено: ${evidenceDefs[h.evidence]?.name||h.label}`:h.label;
        btn.innerHTML=`<span class="evidence-marker" aria-hidden="true">${marker}</span><span class="evidence-label-anchor"><span class="hotspot-label">${label}</span></span>`;
      } else {
        btn.innerHTML=`<span class="hotspot-label">${h.label}</span>`;
      }
      btn.className=classes.join(' ');
      btn.dataset.hotspotId=h.id;
      btn.style.left=h.x+'%';btn.style.top=h.y+'%';btn.style.width=h.w+'%';btn.style.height=h.h+'%';
      if(h.markerX!=null) btn.style.setProperty('--marker-x', h.markerX+'%');
      if(h.markerY!=null) btn.style.setProperty('--marker-y', h.markerY+'%');
      btn.addEventListener('click',()=>handleHotspot(h));
      hs.appendChild(btn);
    });
    setObjective();
  }

  function handleHotspot(h){
    if(h.action==='evidence') collectEvidence(h.evidence);
    if(h.action==='interrogate') openInterrogation(h.suspect);
    if(h.action==='go') goLocation(h.target);
    if(h.action==='note'){ if(!state.notes.includes(h.text)) state.notes.push(h.text); save(); toast('Наблюдение добавлено в блокнот'); }
  }

  function collectEvidence(id){
    if(state.evidence.includes(id)||state.statements.includes(id)){ openEvidenceDetail(id); return; }

    const e=evidenceDefs[id];
    const unlocks=getEvidenceUnlocks(id);
    state.evidence.push(id);
    if(id==='staffKey') state.flags.staffOpen=true;
    if(id==='cellarNote') state.flags.cellarOpen=true;
    if(id==='archiveKey') state.flags.archiveOpen=true;

    save();
    renderScene();

    const locationUnlockText=unlocks.locations.length
      ? `<b>Открыта новая локация:</b> ${unlocks.locations.join(', ')}. `
      : '';
    const discoveryHint=(unlocks.topics.length||unlocks.locations.length)
      ? `<div class="evidence-unlocks quiet"><span>${locationUnlockText}Находка может изменить смысл уже полученных показаний или дать новый повод для разговора.</span></div>`
      : `<div class="evidence-unlocks quiet"><span>Новая улика добавлена в материалы дела.</span></div>`;

    openModal('НАЙДЕНА УЛИКА', e.name, `
      <div class="evidence-discovery">
        <div class="evidence-discovery-icon">${evidenceVisual(id,e.icon)}</div>
        <div class="evidence-discovery-copy">
          <span class="evidence-status-badge new">Новая улика</span>
          <h3>${e.name}</h3>
          <p>${e.desc}</p>
          <div class="evidence-place">⌖ ${e.place}</div>
        </div>
      </div>
      ${discoveryHint}
      <div class="evidence-detective-panel">
        <div class="evidence-detective-photo"><img src="assets/ui/detective-holmes.png" alt="Детектив"></div>
        <div class="evidence-detective-copy">
          <span class="tiny-label">МЫСЛИ ДЕТЕКТИВА</span>
          <p>${getEvidenceDetectiveThought(id)}</p>
        </div>
      </div>
      <div class="evidence-discovery-actions">
        <button class="primary" data-action="close-modal">Продолжить расследование</button>
      </div>`);
  }

  function openEvidenceDetail(id){
    const e=evidenceDefs[id];
    const unlocks=getEvidenceUnlocks(id);
    const topicRows=unlocks.topics.length
      ? `<div class="evidence-related"><div class="tiny-label">СВЯЗАННЫЕ ТЕМЫ ДОПРОСА</div>${unlocks.topics.map(u=>`<div class="related-topic"><b>${u.suspect}</b><span>${u.topic}</span></div>`).join('')}</div>`
      : '';
    openModal('УЛИКА', e.name, `
      <div class="evidence-detail">
        <div class="evidence-detail-icon">${evidenceVisual(id,e.icon)}</div>
        <div>
          <span class="evidence-status-badge found">${evidenceStatusText(id)}</span>
          <h3>${e.name}</h3>
          <p>${e.desc}</p>
          <div class="evidence-place">⌖ Найдено: ${e.place}</div>
        </div>
      </div>
      ${topicRows}
      <div class="evidence-detective-panel evidence-detective-panel-detail">
        <div class="evidence-detective-photo"><img src="assets/ui/detective-holmes.png" alt="Детектив"></div>
        <div class="evidence-detective-copy">
          <span class="tiny-label">МЫСЛИ ДЕТЕКТИВА</span>
          <p>${getEvidenceDetectiveThought(id)}</p>
        </div>
      </div>`);
  }

  function goLocation(id){
    updateOpenLocations();
    if(!locations[id].open){ toast('Эта локация пока закрыта'); return; }
    state.location=id; save(); renderScene(); closeModal();
  }

  function openModal(kicker,title,html){
    $('#modalKicker').textContent=kicker;
    $('#modalTitle').textContent=title;
    $('#modalBody').innerHTML=html;
    document.querySelector('.modal-context-action')?.remove();
    $('#modal')?.classList.remove('detective-nonmodal','universal-system-panel');
    $('#modal .modal-shell')?.classList.remove('final-modal-shell','deduction-modal-shell','detective-modal-shell');
    $('#modalBody')?.classList.remove('final-modal-body','deduction-modal-body','materials-modal-body','detective-modal-body');
    $('#modal').classList.remove('hidden');
  }
  function closeModal(){
    if(caseModalOpen){
      deductionSessionFeedback = null;
      caseModalOpen = false;
    }
    $('#modal')?.classList.remove('detective-nonmodal','universal-system-panel');
    $('#modal .modal-shell')?.classList.remove('final-modal-shell','deduction-modal-shell','detective-modal-shell');
    $('#modalBody')?.classList.remove('final-modal-body','deduction-modal-body','materials-modal-body','detective-modal-body');
    $('#modal').classList.add('hidden');
    setObjective();
  }

  function getDetectiveMoodLabel(mood){
    return ({thoughtful:'Задумался',alert:'Насторожился',curious:'Заинтересовался',insight:'Поймал мысль',skeptical:'Сомневается'})[mood] || 'Размышляет';
  }

  function maybeShowDetectiveInsight(momentKey){
    const insight=detectiveInsightDefs[momentKey];
    if(!insight) return;
    state.detectiveInsightsSeen ||= [];
    if(state.detectiveInsightsSeen.includes(momentKey)) return;
    state.detectiveInsightsSeen.push(momentKey);
    save();

    const moodClass=insight.mood || 'thoughtful';
    const html=`
      <div class="detective-insight-layout mood-${moodClass}">
        <div class="detective-thought-wrap detective-thought-wrap--flow">
          <div class="detective-thought-bubble detective-thought-bubble--flow">
            <div class="detective-flow-photo">
              <div class="detective-portrait-card detective-photo-card">
                <img class="detective-photo" src="assets/ui/detective-holmes.png" alt="Детектив" />
              </div>
            </div>
            <span class="detective-bubble-kicker">Мысли детектива</span>
            <p>${insight.text}</p>
          </div>
        </div>
      </div>`;

    openModal('НОВАЯ ЗАЦЕПКА','Детектив размышляет',html);
    $('#modal')?.classList.add('detective-nonmodal');
    $('#modal .modal-shell')?.classList.add('detective-modal-shell');
    $('#modalBody')?.classList.add('detective-modal-body');
  }

  function currentLeadLocation(){
    const ds=state.deductions||[];
    const marinaProgress=state.interrogationProgress?.['marina:knowledge']?.stage || 0;
    if(!state.talks?.dmitry?.desk) return 'hall';
    if(!state.evidence.includes('dustMark')) return 'office';
    if(!ds.includes('bookOnDesk')) return null;
    if(!state.evidence.includes('camera')) return 'corridor';
    if(!state.talks?.liza?.office) return 'corridor';
    if(!ds.includes('blackoutDecoy')) return null;
    if(!state.evidence.includes('insurance')) return 'office';
    if(!ds.includes('viktorFinancialMotive')) return 'office';
    if(!state.statements.includes('marinaPhrase') || !state.evidence.includes('safe') || marinaProgress<2) return 'office';
    if(state.flags.archiveOpen && (!state.evidence.includes('oldPhoto') || !state.evidence.includes('familyCode'))) return 'archive';
    if(marinaProgress===2 && !state.statements.includes('marinaSawSafe')) return 'office';
    if(ds.includes('marinaAccess') && !state.evidence.includes('cameraMarina')) return 'corridor';
    if(state.evidence.includes('cameraMarina') && !state.statements.includes('viktorAdmission')) return 'office';
    return null;
  }

  function renderMap(){
    updateOpenLocations();
    const target=currentLeadLocation();
    const cards=Object.entries(locations).map(([id,l])=>`<button class="map-node ${!l.open?'locked':''} ${state.location===id?'current':''} ${target===id?'has-lead':''}" data-go="${id}" ${!l.open?'disabled':''}><div class="map-thumb" style="background-image:url('${l.img}')"></div><div class="map-copy"><strong>${l.title}</strong><small>${!l.open?'Закрыто':target===id?'Новая зацепка':l.desc}</small></div></button>`).join('');
    openModal('НАВИГАЦИЯ','Карта ресторана',`<div class="map-grid">${cards}</div>`);
    $$('[data-go]').forEach(b=>b.addEventListener('click',()=>goLocation(b.dataset.go)));
  }

  function renderPeople(){
    const items=Object.entries(suspects).map(([id,s])=>{
      const talked=state.talks[id] ? Object.keys(state.talks[id]).length : 0;
      const keyTopic=keyChainBySuspect[id];
      const keyStage=keyTopic ? (state.interrogationProgress?.[`${id}:${keyTopic}`]?.stage||0) : 0;
      const completed=keyStage>=3;
      const lizaExposed=id==='liza' && state.evidence.includes('staffSchedule') && !!state.talks?.liza?.after;
      const statusClass=completed?'hot status-progress':talked?'warn status-progress':'status-base';
      const statusText=completed?'Ключевая линия изучена':lizaExposed?'Подозреваемая':talked?`Обсуждено тем: ${talked}`:s.status;
      return {id,img:s.img,name:s.name,role:s.role,statusClass,statusText};
    });
    window.DetectivePanels.people({kicker:'ПОДОЗРЕВАЕМЫЕ',title:'Люди',items});
    $$('[data-universal-suspect]').forEach(c=>c.addEventListener('click',()=>{
      const suspectId=c.dataset.universalSuspect;
      const suspect=suspects[suspectId];
      if(suspect?.loc && locations[suspect.loc]){
        state.location=suspect.loc;
        save();
        renderScene();
      }
      closeModal();
      openInterrogation(suspectId);
    }));
  }

  function applyMaterialLibraryFilter(kind){
    window.DetectivePanels.applyMaterialFilter(kind);
  }

  function renderEvidence(){
    const physicalIds=Object.keys(evidenceDefs).filter(id=>evidenceDefs[id].type!=='statement');
    const facts=getAvailableFacts().map(f=>({
      ...f,
      iconHtml:f.kind==='Улика' ? evidenceVisual((f.key||'').replace(/^e:/,''),f.icon) : f.icon
    }));
    const unknownCount=physicalIds.filter(id=>!state.evidence.includes(id)).length;
    window.DetectivePanels.materials({kicker:'МАТЕРИАЛЫ ДЕЛА',title:'Материалы дела',facts,unknownCount});
  }

  function getNotebookObservations(){
    const seen=new Set(state.detectiveInsightsSeen||[]);
    return notebookObservationDefs
      .filter(item=>{
        if(item.trigger && seen.has(item.trigger)) return true;
        if(item.evidence && state.evidence.includes(item.evidence)) return true;
        return false;
      })
      .map(item=>({...item,done:!!item.isDone()}));
  }

  function notebookTab(tab='timeline'){
    let body='';
    if(tab==='timeline'){
      const rows=[
        ['20:05–20:12','Демонстрация семейной книги. После нее книга оказывается на письменном столе Виктора.'],
        state.deductions.includes('viktorHidBook')?['20:18','Первый этап: книга остается в кабинете и оказывается в сейфе Виктора.']:null,
        state.evidence.includes('camera')?['20:26','Камера фиксирует Виктора с обычной папкой документов. Книги при нем нет.']:null,
        state.evidence.includes('breakerLog')?['20:28','Срабатывает кухонный автомат; свет гаснет примерно на полторы минуты.']:null,
        state.evidence.includes('lizaExit')?['20:29','Камера служебного выхода фиксирует, как Лиза покидает ресторан после смены.']:null,
        state.evidence.includes('kitchenOrders')?['20:29–20:35','Лента заказов подтверждает непрерывную работу кухни в критический промежуток.']:null,
        state.evidence.includes('dmitryRecorder')?['20:30–20:35','Диктофон Дмитрия непрерывно записывает события в главном зале.']:null,
        state.talks?.anton?.napkin?['20:30','Марина просит у Антона большую льняную салфетку.']:null,
        state.evidence.includes('hallPhoto')?['20:33',state.talks?.pavel?.alibi?'На снимке юбилейного тоста Павла нет в зале. Павел утверждает, что в это время выходил на улицу покурить.':'На снимке юбилейного тоста Павла нет в зале. Причина его отсутствия пока не установлена.']:null,
        state.evidence.includes('cameraMarina')?['20:34','Камера фиксирует Марину со свертком размером с книгу.']:null,
        state.evidence.includes('foundBook')?['После 20:34','Семейная книга обнаружена в архиве.']:null
      ].filter(Boolean);
      body=`<div class="timeline">${rows.map(r=>`<div class="timeline-row"><time>${r[0]}</time><div>${r[1]}</div></div>`).join('')}</div>`;
    }
    if(tab==='notes'){
      const observations=getNotebookObservations();
      const observationRows=observations.map(item=>`
        <div class="note observation-task ${item.done?'done':''}">
          <span class="observation-task-mark">${item.done?'✓':'○'}</span>
          <span>${item.text}</span>
        </div>`).join('');
      const regularRows=state.notes.map(n=>`<div class="note">${n}</div>`).join('');
      body=`<div class="note-list">${observationRows}${regularRows || (!observationRows?'<div class="card"><p>Пока нет наблюдений.</p></div>':'')}</div>`;
    }
    if(tab==='statements'){
      const entries=[];
      Object.entries(state.talks).forEach(([sid,topics])=>Object.values(topics).forEach(t=>{ if(t.statement) entries.push(`<div class="note quote"><b>${suspects[sid].name}:</b><br>${t.text}</div>`); }));
      if(state.statements.includes('marinaPhrase')) entries.push(`<div class="note quote"><b>Марина Орлова:</b><br>«Он не имел права прятать ее в сейф.»</div>`);
      body=`<div class="note-list">${entries.length?entries.join(''):'<div class="card"><p>Пока нет зафиксированных показаний.</p></div>'}</div>`;
    }
    $('#modalBody').innerHTML=window.DetectivePanels.notebookHtml(tab,body);
    $$('[data-tab]').forEach(b=>b.addEventListener('click',()=>notebookTab(b.dataset.tab)));
  }

  function renderNotebook(){
    window.DetectivePanels.notebook({kicker:'РАБОЧИЕ ЗАПИСИ',title:'Блокнот',active:'timeline',body:''});
    notebookTab('timeline');
  }

  function renderCase(){
    caseModalOpen = true;
    const facts=getAvailableFacts();
    const factMap=new Map(facts.map(f=>[f.key,f]));
    let activeTool='matrix';
    let activeVersionId='';
    let selectedRouteId='';
    let versionSelection=[];
    let versionFeedback='';
    let contradictionStatement='';
    let contradictionEvidence='';
    let contradictionFeedback='';
    let timelineFeedback='';

    const kindClass=kind=>kind==='Улика'?'evidence':kind==='Показание'?'testimony':'deduction';
    const relationName=id=>deductionRelationDefs[id]?.label||'Логическая связь';

    const versionDefs=[
      {
        id:'bookOnDesk',group:'main',title:'Книга после демонстрации осталась в кабинете',
        desc:'Проверьте, действительно ли книга после показа не вернулась в витрину.',
        solved:'bookOnDesk',unlockAny:['e:dustMark','t:dmitry:desk'],
        routes:[{id:'proof',label:'Проверка местонахождения',deductionId:'bookOnDesk',requires:['e:dustMark','t:dmitry:desk'],conditions:['Независимое показание о том, где осталась книга','Физический след, подтверждающий это показание']}]
      },
      {
        id:'viktorAction',group:'main',title:'Виктор спрятал книгу в сейфе кабинета',
        desc:'Версия должна объяснить, где оставалась книга и почему Виктор вышел без нее.',
        solved:'viktorHidBook',unlockAny:['d:bookOnDesk','e:camera','e:safe','d:viktorFinancialMotive'],
        routes:[
          {id:'camera',label:'Путь по хронологии',deductionId:'viktorHidBookCamera',requires:['d:bookOnDesk','e:camera','e:safe'],conditions:['Книга после демонстрации оставалась в кабинете','Виктор покинул кабинет без книги','В кабинете было место, где книгу можно было скрыть без взлома']},
          {id:'finance',label:'Путь через мотив',deductionId:'viktorHidBookFinance',requires:['d:bookOnDesk','e:safe','d:viktorFinancialMotive'],conditions:['Книга после демонстрации оставалась в кабинете','В кабинете было место для скрытого хранения','У Виктора был установленный мотив создать видимость исчезновения']}
        ]
      },
      {
        id:'marinaAccess',group:'main',title:'Марина могла самостоятельно открыть сейф',
        desc:'Недостаточно знать о существовании сейфа: нужно доказать реальную возможность открыть его.',
        solved:'marinaAccess',unlockAny:['d:marinaKnewSafe','t:marina:code','e:familyCode','e:safe'],
        routes:[
          {id:'archive',label:'Путь через противоречие',deductionId:'marinaAccessArchive',requires:['d:marinaKnewSafe','e:familyCode','e:safe'],conditions:['Установлено, что Марина знала о сейфе раньше','Семейный код оставался действующим','Сейф не был вскрыт силой']},
          {id:'admission',label:'Путь через признание',deductionId:'marinaAccessDialogue',requires:['t:marina:code','e:familyCode','e:safe'],conditions:['Марина признала знание семейного кода','Архивная запись подтверждает действующий код','Сейф не был вскрыт силой']}
        ]
      },
      {
        id:'marinaMovement',group:'main',title:'Марина перенесла книгу через служебную часть',
        desc:'Проверьте, есть ли независимая цепочка от доступа к сейфу до перемещения свертка.',
        solved:'marinaMovedBook',unlockAny:['d:marinaAccess','e:cameraMarina','e:linenNapkin','t:anton:napkin','t:liza:marina'],
        routes:[
          {id:'camera',label:'Путь через камеру',deductionId:'marinaMovedCamera',requires:['d:marinaAccess','e:cameraMarina'],conditions:['Марина имела доступ к сейфу','После этого камера фиксирует ее со свертком подходящего размера']},
          {id:'kitchen',label:'Путь через кухню',deductionId:'marinaMovedKitchen',requires:['d:marinaAccess','e:linenNapkin','t:anton:napkin'],conditions:['Марина имела доступ к сейфу','Исчезла большая льняная салфетка','Антон подтверждает, что салфетку взяла Марина']},
          {id:'witness',label:'Путь через свидетеля',deductionId:'marinaMovedWitness',requires:['d:marinaAccess','e:linenNapkin','t:liza:marina'],conditions:['Марина имела доступ к сейфу','Есть материал, объясняющий сверток','Лиза видела Марину со свертком в служебной части']}
        ]
      },
      {
        id:'viktorMotive',group:'optional',title:'У Виктора был финансовый мотив',
        desc:'Проверьте, могло ли исчезновение книги дать Виктору финансовую выгоду.',
        solved:'viktorFinancialMotive',unlockAny:['e:insurance','e:financialDoc'],
        routes:[{id:'motive',label:'Финансовая проверка',deductionId:'viktorFinancialMotive',requires:['e:insurance','e:financialDoc'],conditions:['Документы подтверждают финансовые проблемы','Исчезновение книги могло создать страховую выгоду']}]
      },
      {
        id:'blackout',group:'optional',title:'Отключение света было случайным',
        desc:'Проверьте, был ли сбой частью плана или обычной аварией.',
        solved:'blackoutAccident',unlockAny:['e:breakerLog','t:anton:blackout'],
        routes:[{id:'accident',label:'Проверка причины сбоя',deductionId:'blackoutAccident',requires:['e:breakerLog','t:anton:blackout'],conditions:['Есть показание о бытовой причине отключения','Техническая запись независимо подтверждает эту причину']}]
      },
      {
        id:'pavelLiza',group:'optional',title:'Сделка Павла и Лизы касалась фотографий страниц, а не всей книги',
        desc:'Проверьте границы их тайной договоренности и отделите ее от основной кражи.',
        solved:'pavelLizaDeal',unlockAny:['e:lizaPayment','t:liza:payment','e:recipePhotos'],
        routes:[{id:'photos',label:'Проверка сделки',deductionId:'pavelLizaDeal',requires:['e:lizaPayment','t:liza:payment','e:recipePhotos'],conditions:['Между Павлом и Лизой был денежный расчет','Лиза объяснила назначение платежа','Найденный предмет подтверждает, что передавались именно изображения страниц']}]
      },
      {
        id:'antonCopy',group:'optional',title:'Копия Антона не связана с нынешним исчезновением',
        desc:'Проверьте возраст найденной копии и не принимайте старый проступок за новое преступление.',
        solved:'antonOldCopy',unlockAny:['e:copiedRecipe','e:kitchenLog'],
        routes:[{id:'old',label:'Проверка возраста копии',deductionId:'antonOldCopy',requires:['e:copiedRecipe','e:kitchenLog'],conditions:['Найдена копия рецепта','Есть независимая запись, позволяющая установить, когда она появилась']}]
      },
      {
        id:'dmitryHistory',group:'optional',title:'Интерес Дмитрия связан с историей его отца',
        desc:'Проверьте, подтверждается ли его рассказ независимым архивным материалом.',
        solved:'dmitryHistory',unlockAny:['e:archiveLetter','t:dmitry:father'],
        routes:[{id:'history',label:'Проверка семейной истории',deductionId:'dmitryHistory',requires:['e:archiveLetter','t:dmitry:father'],conditions:['Дмитрий рассказал о связи отца с Орловыми','Архив содержит независимое подтверждение этой связи']}]
      }
    ];

    const versionAvailable=v=>!(v.unlockAny||[]).length || v.unlockAny.some(investigationFactAvailable);
    const versionSolved=v=>deductionSatisfied(v.solved);
    const routeReady=r=>(r.requires||[]).every(investigationFactAvailable);
    const versionReady=v=>!versionSolved(v) && (v.routes||[]).some(routeReady);

    const contradictionDefs=[
      {
        id:'marina-safe',
        statement:'t:marina:knowledge',
        evidence:'e:oldPhoto',
        deductionId:'marinaKnewSafe',
        result:'Марина заранее знала о сейфе',
        explanation:'Марина отрицала знание сейфа, но старая фотография показывает ее рядом с этим же семейным сейфом.'
      }
    ];

    const timelineDefs=[
      {id:'book-desk',rank:10,time:'После демонстрации',text:'Книга остается на письменном столе Виктора.',available:()=>deductionSatisfied('bookOnDesk')},
      {id:'viktor-safe',rank:20,time:'До 20:26',text:'Виктор прячет книгу в сейфе кабинета.',available:()=>deductionSatisfied('viktorHidBook')},
      {id:'viktor-exit',rank:30,time:'20:26',text:'Виктор выходит из кабинета без книги.',available:()=>state.evidence.includes('camera')},
      {id:'blackout',rank:40,time:'После 20:26',text:'Происходит отключение света.',available:()=>state.evidence.includes('breakerLog')||deductionSatisfied('blackoutAccident')},
      {id:'napkin',rank:50,time:'После восстановления света',text:'Марина берет у Антона большую льняную салфетку.',available:()=>!!state.talks?.anton?.napkin},
      {id:'toast',rank:60,time:'20:33',text:'На юбилейном тосте Павла нет в зале.',available:()=>state.evidence.includes('hallPhoto')},
      {id:'marina-camera',rank:70,time:'20:34',text:'Марина проходит по служебному коридору со свертком.',available:()=>state.evidence.includes('cameraMarina')},
      {id:'book-found',rank:80,time:'Позже',text:'Книга обнаружена в семейном архиве.',available:()=>state.evidence.includes('foundBook')}
    ];


    // Экспериментальная механика «Матрица подозреваемых».
    // Игрок сравнивает не готовые версии преступления, а свойства каждого человека:
    // мотив, доступ, возможность действовать и качество алиби. Ячейка заполняется
    // только после проверки конкретными материалами дела.
    const suspectMatrixColumns=window.DetectivePanels.suspectMatrixColumns();

    const suspectMatrixCellDefs={
      'viktor:motive':{
        question:'Был ли у Виктора мотив инсценировать исчезновение книги?',
        relevant:['e:insurance','e:financialDoc','t:viktor:money','t:viktor:insurance'],
        routes:[{requires:['e:insurance','e:financialDoc'],status:'yes',label:'Доказано',result:'Финансовый интерес подтвержден',explanation:'Повышенная страховка и финансовые проблемы создавали для Виктора возможную выгоду от страхового случая.',deductionId:'viktorFinancialMotive'}]
      },
      'viktor:access':{
        question:'Имел ли Виктор доступ к месту, где книгу можно было скрыть?',
        relevant:['e:safe','t:viktor:safeAdmission'],
        routes:[
          {requires:['e:safe'],status:'yes',label:'Доказано',result:'Доступ к сейфу очевиден',explanation:'Сейф находится в кабинете Виктора и является частью его рабочего пространства.'},
          {requires:['t:viktor:safeAdmission'],status:'yes',label:'Доказано',result:'Доступ признан',explanation:'Виктор прямо признает, что сам убрал книгу в сейф.'}
        ]
      },
      'viktor:opportunity':{
        question:'Была ли у Виктора возможность распоряжаться книгой после демонстрации и до выхода из кабинета?',
        relevant:['e:dustMark','t:dmitry:desk','d:bookOnDesk','e:camera','e:safe','t:viktor:before2026'],
        routes:[
          {requires:['e:dustMark','t:dmitry:desk'],status:'partial',label:'Частично',result:'Книга после демонстрации оставалась в кабинете Виктора',explanation:'Показание Дмитрия и физический след подтверждают, что книга не вернулась сразу в витрину. Это создает временное окно, но еще не показывает, что именно Виктор сделал дальше.',deductionId:'bookOnDesk'},
          {requires:['d:bookOnDesk','e:camera'],status:'partial',label:'Частично',result:'Временное окно подтверждено',explanation:'Книга оставалась в кабинете, а в 20:26 Виктор вышел уже без нее. Это подтверждает возможность действовать до выхода, но пока не устанавливает, куда именно была убрана книга.'},
          {requires:['d:bookOnDesk','e:camera','e:safe'],status:'yes',label:'Доказано',result:'Первый этап исчезновения установлен',explanation:'Книга оставалась в кабинете, в 20:26 Виктор вышел без нее, а сейф не имеет следов взлома. Совокупность фактов подтверждает, что Виктор первым спрятал книгу в сейфе.',deductionId:'viktorHidBookCamera'}
        ]
      },
      'viktor:alibi':{
        question:'Исключает ли камера Виктора из событий?',
        relevant:['e:camera','t:viktor:before2026'],
        routes:[{requires:['e:camera'],status:'partial',label:'Частично',result:'Камера исключает вынос книги, но не действия внутри кабинета',explanation:'Кадр 20:26 показывает, что Виктор вышел без книги. Это не алиби на период до выхода и не исключает сокрытие книги внутри кабинета.'}]
      },

      'marina:motive':{
        question:'Был ли у Марины собственный мотив вмешаться в судьбу книги?',
        relevant:['t:marina:family','e:archiveOwnership','t:dmitry:observed'],
        routes:[{requires:['t:marina:family','e:archiveOwnership'],status:'yes',label:'Доказано',result:'Семейный мотив подтвержден',explanation:'Марина считала книгу общей семейной реликвией и была против единоличного контроля Виктора.',deductionId:'marinaFamilyMotive'}]
      },
      'marina:access':{
        question:'Могла ли Марина самостоятельно открыть сейф?',
        relevant:['d:marinaKnewSafe','t:marina:code','e:familyCode','e:safe','e:oldPhoto'],
        routes:[
          {requires:['d:marinaKnewSafe','e:familyCode','e:safe'],status:'yes',label:'Доказано',result:'Доступ к сейфу подтвержден',explanation:'Марина заранее знала о сейфе, семейный код оставался действующим, а следов взлома нет.',deductionId:'marinaAccessArchive'},
          {requires:['t:marina:code','e:familyCode','e:safe'],status:'yes',label:'Доказано',result:'Доступ к сейфу подтвержден',explanation:'Марина признала знание семейного кода; архивная запись подтверждает, что он оставался действующим.',deductionId:'marinaAccessDialogue'}
        ]
      },
      'marina:opportunity':{
        question:'Была ли у Марины возможность переместить книгу после действий Виктора?',
        relevant:['d:marinaAccess','e:cameraMarina','t:liza:marina','e:linenNapkin','t:anton:napkin'],
        routes:[
          {requires:['d:marinaAccess','e:cameraMarina'],status:'yes',label:'Доказано',result:'Возможность подтверждена камерой',explanation:'Марина могла открыть сейф, а в 20:34 камера фиксирует ее в служебной части со свертком подходящего размера.',deductionId:'marinaMovedCamera'},
          {requires:['d:marinaAccess','e:linenNapkin','t:anton:napkin'],status:'yes',label:'Доказано',result:'Возможность подтверждена кухонной веткой',explanation:'После получения доступа к сейфу Марина берет большую салфетку, пригодную для упаковки книги.',deductionId:'marinaMovedKitchen'}
        ]
      },
      'marina:alibi':{
        question:'Есть ли у Марины алиби на весь критический промежуток?',
        relevant:['e:hallPhoto','e:cameraMarina','t:marina:where'],
        routes:[{requires:['e:hallPhoto','e:cameraMarina'],status:'no',label:'Нет',result:'Полного алиби нет',explanation:'В 20:33 Марина находится в зале, но уже в 20:34 камера фиксирует ее в служебном коридоре. Снимок тоста не закрывает весь критический промежуток.'}]
      },

      'pavel:motive':{
        question:'Подтвержден ли у Павла мотив похитить всю книгу?',
        relevant:['t:pavel:interest','e:lizaPayment','t:pavel:payment','e:recipePhotos','t:liza:payment'],
        routes:[{requires:['e:lizaPayment','t:liza:payment','e:recipePhotos'],status:'partial',label:'Частично',result:'Интерес к рецептам есть, мотив похитить всю книгу не доказан',explanation:'Тайная сделка Павла и Лизы касалась фотографий отдельных страниц. Она делает Павла подозрительным, но не доказывает интерес к похищению самой книги.',deductionId:'pavelLizaDeal'}]
      },
      'pavel:opportunity':{
        question:'Что известно о Павле в 20:33?',
        relevant:['e:hallPhoto','t:pavel:alibi'],
        routes:[{requires:['e:hallPhoto','t:pavel:alibi'],status:'partial',label:'Неясно',result:'Отсутствие объяснено, но независимо не подтверждено',explanation:'Павла нет на снимке 20:33. Он говорит, что выходил покурить, но отдельного подтверждения этому пока нет.'}]
      },
      'pavel:alibi':{
        question:'Есть ли независимое подтверждение алиби Павла?',
        relevant:['e:hallPhoto','t:pavel:alibi'],
        routes:[{requires:['e:hallPhoto','t:pavel:alibi'],status:'partial',label:'Слабое',result:'Алиби остается только со слов Павла',explanation:'Фотография подтверждает лишь отсутствие Павла в зале, но не то, что он действительно находился на улице.'}]
      },

      'liza:motive':{
        question:'Показывает ли тайная сделка Лизы мотив украсть всю книгу?',
        relevant:['e:lizaPayment','t:liza:payment','e:recipePhotos'],
        routes:[{requires:['e:lizaPayment','t:liza:payment','e:recipePhotos'],status:'no',label:'Не доказан',result:'Сделка касалась фотографий, а не книги',explanation:'Деньги и конверт подтверждают передачу фотографий отдельных страниц. Это отдельный проступок, но не мотив похитить всю реликвию.',deductionId:'pavelLizaDeal'}]
      },
      'liza:opportunity':{
        question:'Находилась ли Лиза в ресторане и могла ли перемещаться по служебной части?',
        relevant:['e:staffSchedule','t:liza:scheduleLie','t:liza:afterTruth'],
        routes:[{requires:['e:staffSchedule','t:liza:afterTruth'],status:'yes',label:'Доказано',result:'Присутствие и доступ к служебному маршруту подтверждены',explanation:'Доска смен показывает, что Лиза работала вечером, а после предъявления расписания она признала присутствие и рассказала, что после восстановления света заходила в комнату персонала. Возможность перемещаться по служебной части была.'}]
      },
      'liza:alibi':{
        question:'Есть ли у Лизы надежное алиби на критический промежуток?',
        relevant:['t:liza:after','e:staffSchedule','t:liza:scheduleLie','t:liza:afterTruth','e:lizaExit'],
        routes:[{requires:['e:lizaExit','t:liza:afterTruth'],status:'yes',label:'Доказано',result:'Лиза покинула ресторан до критического промежутка',explanation:'После разоблачения Лиза признала ранний уход. Камера служебного выхода независимо подтверждает: она переоделась, забрала рабочую форму и покинула ресторан. Ее ложь касалась нарушения смены, а не похищения книги.'}]
      },

      'anton:motive':{
        question:'Доказывает ли копия рецепта мотив Антона украсть книгу сейчас?',
        relevant:['e:copiedRecipe','e:kitchenLog','t:anton:copy','t:anton:copyAge'],
        routes:[{requires:['e:copiedRecipe','e:kitchenLog'],status:'no',label:'Нет',result:'Копия относится к старому эпизоду',explanation:'Журнал кухни показывает, что копия рецепта существовала задолго до нынешнего исчезновения. Эта находка не подтверждает мотив текущей кражи.',deductionId:'antonOldCopy'}]
      },
      'anton:opportunity':{
        question:'Что известно о действиях Антона во время отключения света?',
        relevant:['e:breakerLog','t:anton:blackout','t:anton:after'],
        routes:[{requires:['e:breakerLog','t:anton:blackout'],status:'partial',label:'Ограничена',result:'Антон связан с кухней и аварией, а не с подготовленным саботажем',explanation:'Техническая запись подтверждает бытовую перегрузку. Это снижает подозрение в заранее подготовленном отключении, но не создает абсолютного алиби.',deductionId:'blackoutAccident'}]
      },
      'anton:alibi':{
        question:'Есть ли независимое подтверждение, что Антон оставался на кухне?',
        relevant:['e:breakerLog','t:anton:blackout','e:kitchenOrders'],
        routes:[{requires:['e:kitchenOrders','e:breakerLog'],status:'yes',label:'Доказано',result:'Антон оставался на кухне в критический промежуток',explanation:'Технический журнал фиксирует кухонную аварию, а лента заказов показывает непрерывную выдачу блюд в тот же промежуток. Совокупность независимых записей подтверждает местонахождение Антона.'}]
      },

      'dmitry:motive':{
        question:'Был ли интерес Дмитрия связан именно с похищением книги?',
        relevant:['t:dmitry:father','e:archiveLetter','t:dmitry:interest'],
        routes:[{requires:['t:dmitry:father','e:archiveLetter'],status:'no',label:'Не доказан',result:'Интерес связан с семейной историей',explanation:'Архивное письмо подтверждает рассказ Дмитрия об отце. Его интерес к книге имеет историческую основу и сам по себе не доказывает мотив кражи.',deductionId:'dmitryHistory'}]
      },
      'dmitry:access':{
        question:'Имел ли Дмитрий актуальный доступ к семейному архиву?',
        relevant:['t:dmitry:selfArchive','t:dmitry:archiveAccess'],
        routes:[{requires:['t:dmitry:selfArchive'],status:'no',label:'Нет',result:'Текущий доступ не подтвержден',explanation:'Дмитрий говорит, что бывал в архиве лишь один раз много лет назад вместе с отцом и после его смерти туда не заходил.'}]
      },
      'dmitry:alibi':{
        question:'Есть ли независимое подтверждение алиби Дмитрия?',
        relevant:['e:hallPhoto','e:dmitryRecorder'],
        routes:[{requires:['e:dmitryRecorder','e:hallPhoto'],status:'yes',label:'Доказано',result:'Дмитрий находился в главном зале',explanation:'Диктофон вел непрерывную запись в зале, а фотография юбилейного тоста независимо подтверждает Дмитрия среди присутствующих. Вместе эти материалы закрывают критический промежуток.'}]
      }
    };


    // Экспериментальная механика «Реконструкция преступления».
    // Игрок собирает каждый этап из трех частей: участник/предмет -> действие -> место/способ.
    // Сама собранная сцена еще не считается доказанной: игра дополнительно проверяет,
    // достаточно ли уже найденных материалов для такого вывода.
    const reconstructionStages=[
      {
        id:'after-demo',number:1,moment:'После демонстрации',title:'Что произошло с книгой сразу после показа?',
        unlockAny:['e:dustMark','t:dmitry:desk','d:bookOnDesk'], solved:()=>deductionSatisfied('bookOnDesk'),
        known:['e:dustMark','t:dmitry:desk'],
        fields:[
          {id:'subject',label:'Что',options:[['book','Семейная книга'],['folder','Папка документов'],['photos','Фотографии рецептов'],['napkin','Льняная салфетка']]},
          {id:'action',label:'Что произошло',options:[['stayed','Осталась'],['returned','Была возвращена'],['taken','Была унесена'],['passed','Была передана']]},
          {id:'place',label:'Где / у кого',options:[['desk','На столе Виктора'],['case','В витрине'],['dmitry','У Дмитрия'],['pavel','У Павла']]}
        ],
        answer:{subject:'book',action:'stayed',place:'desk'},
        routes:[{requires:['e:dustMark','t:dmitry:desk'],deductionId:'bookOnDesk'}],
        result:'Книга после демонстрации осталась на столе в кабинете Виктора.'
      },
      {
        id:'viktor',number:2,moment:'До 20:26',title:'Что Виктор сделал с книгой перед выходом?',
        unlockAny:['d:bookOnDesk','e:camera','e:safe','d:viktorFinancialMotive'], solved:()=>deductionSatisfied('viktorHidBook'),
        known:['d:bookOnDesk','e:camera','e:safe','d:viktorFinancialMotive'],
        fields:[
          {id:'person',label:'Кто',options:[['viktor','Виктор'],['marina','Марина'],['pavel','Павел'],['dmitry','Дмитрий']]},
          {id:'action',label:'Что сделал',options:[['hid','Спрятал книгу'],['carried','Вынес книгу'],['returned','Вернул книгу'],['passed','Передал книгу']]},
          {id:'place',label:'Куда / кому',options:[['safe','В сейф'],['case','В витрину'],['hall','В главный зал'],['pavel','Павлу']]}
        ],
        answer:{person:'viktor',action:'hid',place:'safe'},
        routes:[
          {requires:['d:bookOnDesk','e:camera','e:safe'],deductionId:'viktorHidBookCamera'},
          {requires:['d:bookOnDesk','e:safe','d:viktorFinancialMotive'],deductionId:'viktorHidBookFinance'}
        ],
        result:'Виктор спрятал книгу в сейфе кабинета до своего выхода.'
      },
      {
        id:'access',number:3,moment:'После действий Виктора',title:'Кто мог самостоятельно открыть сейф?',
        unlockAny:['e:oldPhoto','d:marinaKnewSafe','t:marina:code','e:familyCode','e:safe'], solved:()=>deductionSatisfied('marinaAccess'),
        known:['t:marina:knowledge','e:oldPhoto','d:marinaKnewSafe','t:marina:code','e:familyCode','e:safe'],
        fields:[
          {id:'person',label:'Кто',options:[['marina','Марина'],['liza','Лиза'],['pavel','Павел'],['anton','Антон']]},
          {id:'action',label:'Что сделал',options:[['opened','Открыл сейф'],['broke','Взломал сейф'],['foundkey','Нашел ключ'],['asked','Попросил открыть']]},
          {id:'method',label:'Каким способом',options:[['code','Семейным кодом'],['key','Ключом'],['force','Силой'],['viktor','С помощью Виктора']]}
        ],
        answer:{person:'marina',action:'opened',method:'code'},
        routes:[
          {requires:['d:marinaKnewSafe','e:familyCode','e:safe'],deductionId:'marinaAccessArchive'},
          {requires:['t:marina:code','e:familyCode','e:safe'],deductionId:'marinaAccessDialogue'},
          {requires:['t:marina:knowledge','e:oldPhoto','e:familyCode','e:safe'],deductionId:'marinaAccessArchive',also:['marinaKnewSafe']}
        ],
        result:'Марина знала о сейфе и могла открыть его действующим семейным кодом.'
      },
      {
        id:'movement',number:4,moment:'После отключения света',title:'Что произошло с книгой после сейфа?',
        unlockAny:['d:marinaAccess','e:cameraMarina','e:linenNapkin','t:anton:napkin','t:liza:marina'], solved:()=>deductionSatisfied('marinaMovedBook'),
        known:['d:marinaAccess','e:cameraMarina','e:linenNapkin','t:anton:napkin','t:liza:marina'],
        fields:[
          {id:'person',label:'Кто',options:[['marina','Марина'],['liza','Лиза'],['anton','Антон'],['pavel','Павел']]},
          {id:'action',label:'Что сделал',options:[['moved','Перенес книгу'],['left','Оставил книгу'],['returned','Вернул книгу'],['destroyed','Уничтожил книгу']]},
          {id:'route',label:'Куда / каким путем',options:[['service','Через служебную часть'],['hall','Через главный зал'],['cellar','В винный погреб'],['kitchen','На кухню']]}
        ],
        answer:{person:'marina',action:'moved',route:'service'},
        routes:[
          {requires:['d:marinaAccess','e:cameraMarina'],deductionId:'marinaMovedCamera'},
          {requires:['d:marinaAccess','e:linenNapkin','t:anton:napkin'],deductionId:'marinaMovedKitchen'},
          {requires:['d:marinaAccess','e:linenNapkin','t:liza:marina'],deductionId:'marinaMovedWitness'}
        ],
        result:'Марина вынесла книгу из сейфа и переместила ее через служебную часть ресторана.'
      },
      {
        id:'final-place',number:5,moment:'Конец маршрута',title:'Где закончился путь семейной книги?',
        unlockAny:['e:foundBook'], solved:()=>deductionSatisfied('twoStages'),
        known:['e:foundBook','d:viktorHidBook','d:marinaMovedBook'],
        fields:[
          {id:'subject',label:'Что',options:[['book','Семейная книга'],['folder','Папка Виктора'],['photos','Фотографии страниц'],['copy','Копия рецепта']]},
          {id:'action',label:'Что произошло',options:[['found','Была обнаружена'],['hidden','Осталась спрятана'],['sold','Была продана'],['destroyed','Была уничтожена']]},
          {id:'place',label:'Где',options:[['archive','В семейном архиве'],['cellar','В винном погребе'],['staff','В комнате персонала'],['kitchen','На кухне']]}
        ],
        answer:{subject:'book',action:'found',place:'archive'},
        routes:[{requires:['e:foundBook','d:viktorHidBook','d:marinaMovedBook'],deductionId:'twoStages'}],
        result:'Книга была обнаружена в семейном архиве. Полный маршрут можно восстановить от стола Виктора до архива.'
      }
    ];

    window.DetectivePanels.investigation({
      title:'Дело «Семейный рецепт»',
      tabTitle:'Матрица подозреваемых',
      tabSubtitle:'Сравните всех персонажей по фактам',
      body:''
    });

    function materialCard(f,selected=false,attr='data-version-fact'){
      const body=f.kind==='Показание'?`<span>${f.text}</span>`:(f.kind==='Вывод'?`<span>${f.text||''}</span>`:'');
      return `<button class="case-material kind-${kindClass(f.kind)} ${selected?'selected':''}" ${attr}="${f.key}">
        <span class="case-material-icon">${f.icon}</span>
        <span><small>${f.kind}</small><b>${f.title}</b>${body}</span>
        <em>${selected?'✓':''}</em>
      </button>`;
    }

    function captureCaseToolScroll(){
      const root=$('#caseToolBody');
      if(!root) return null;
      const selectors=['.suspect-matrix-scroll','.suspect-matrix-detail','.case-reconstruction-stage-list','.case-reconstruction-main','.case-reconstruction-options','.case-version-list','.case-version-main','.case-material-grid','.case-timeline-tool','.case-contradiction-tool','.case-contradiction-list'];
      const state={};
      selectors.forEach(sel=>{
        state[sel]=[...root.querySelectorAll(sel)].map(el=>({top:el.scrollTop,left:el.scrollLeft}));
      });
      return state;
    }

    function restoreCaseToolScroll(state){
      if(!state) return;
      const root=$('#caseToolBody');
      if(!root) return;
      Object.entries(state).forEach(([sel,values])=>{
        [...root.querySelectorAll(sel)].forEach((el,i)=>{
          const pos=values?.[i];
          if(!pos) return;
          el.scrollTop=pos.top;
          el.scrollLeft=pos.left;
        });
      });
    }


    function renderSuspectMatrix(preserveScroll=false){
      const scrollState=preserveScroll?captureCaseToolScroll():null;
      state.suspectMatrixResults ||= {};

      // В текущей версии расследование идет только через Матрицу подозреваемых.
      // Как только оба этапа исчезновения доказаны и книга найдена, фиксируем
      // общий вывод автоматически, чтобы финал не зависел от удаленного режима «Хронология».
      if(deductionReadyForFinal() && state.evidence.includes('foundBook') && !deductionSatisfied('twoStages')){
        pushDeductionHistory(['d:viktorHidBook','d:marinaMovedBook','e:foundBook'],'matrix',true,'twoStages');
        addDeduction('twoStages');
      }
      const matrixStoryReady=deductionReadyForFinal() && deductionSatisfied('twoStages') && state.evidence.includes('foundBook');
      const matrixFinalReady=matrixStoryReady && matrixAllAlibisResolved();
      const matrixAlibisDone=matrixResolvedAlibiCount();
      const matrixAlibisLeft=matrixUnresolvedAlibiCount();
      const suspectOrder=['viktor','marina','pavel','liza','anton','dmitry'];
      const statusMeta={
        yes:{symbol:'✓',className:'yes'},
        no:{symbol:'×',className:'no'},
        partial:{symbol:'~',className:'partial'}
      };
      const cellKey=(sid,cid)=>`${sid}:${cid}`;
      const cellDef=(sid,cid)=>suspectMatrixCellDefs[cellKey(sid,cid)]||null;
      const availableRelevant=def=>[...new Set((def?.relevant||[]).filter(investigationFactAvailable))];
      const cellReady=def=>!!def && (def.routes||[]).some(r=>(r.requires||[]).every(investigationFactAvailable));

      let activeKey=state.suspectMatrixActiveCell||'';
      if(!activeKey || !suspectMatrixCellDefs[activeKey]){
        const firstReady=Object.entries(suspectMatrixCellDefs).find(([,d])=>cellReady(d));
        const firstAvailable=Object.entries(suspectMatrixCellDefs).find(([,d])=>availableRelevant(d).length);
        activeKey=(firstReady||firstAvailable||Object.entries(suspectMatrixCellDefs)[0]||[])[0]||'';
        state.suspectMatrixActiveCell=activeKey;
      }
      let matrixSelection=[];

      const rows=suspectOrder.map(sid=>{
        const s=suspects[sid];
        const cells=suspectMatrixColumns.map(col=>{
          const key=cellKey(sid,col.id);
          const def=cellDef(sid,col.id);
          const result=state.suspectMatrixResults[key];
          const meta=result?statusMeta[result.status]:null;
          const ready=!result&&cellReady(def);
          const hasData=!result&&def&&availableRelevant(def).length>0;
          const cls=result?`resolved ${meta?.className||''}`:ready?'ready':hasData?'available':'unknown';
          const symbol=result?(meta?.symbol||'•'):ready?'!':hasData?'•':'?';
          const label=result?(result.label||'Проверено'):ready?'Можно попытаться проверить':hasData?'Можно попытаться проверить':'Нет материалов';
          return `<td><button class="suspect-matrix-cell ${cls} ${activeKey===key?'active':''}" data-matrix-cell="${key}"><span>${symbol}</span><b>${label}</b></button></td>`;
        }).join('');
        return {img:s.img,name:s.name,role:s.role,cellsHtml:cells};
      });

      const [activeSid,activeCol]=activeKey.split(':');
      const activeSuspect=suspects[activeSid];
      const activeColumn=suspectMatrixColumns.find(c=>c.id===activeCol);
      const def=suspectMatrixCellDefs[activeKey];
      const result=state.suspectMatrixResults[activeKey];
      const relevant=availableRelevant(def);
      const activeMeta=result?statusMeta[result.status]:null;

      let detail='';
      if(!def){
        detail=`<div class="suspect-matrix-empty"><b>Пока нечего проверять</b><p>В текущем сценарии нет материалов, которые позволили бы надежно оценить этот пункт для выбранного персонажа.</p></div>`;
      }else if(result){
        detail=`<div class="suspect-matrix-result ${activeMeta?.className||''}"><span>${activeMeta?.symbol||'✓'}</span><div><small>${activeColumn?.label||''}</small><h3>${result.result}</h3><p>${result.explanation}</p><button class="secondary" id="recheckMatrixCell">Перепроверить ячейку</button></div></div>`;
      }else{
        const cards=relevant.map(k=>{
          const f=factMap.get(k);
          if(!f) return '';
          return materialCard(f,matrixSelection.includes(k),'data-matrix-fact');
        }).join('');
        detail=`
          <div class="case-tool-heading suspect-matrix-detail-head"><span class="tiny-label">${activeColumn?.label||'ПРОВЕРКА'}</span><h2>${activeSuspect?.name||''}</h2><p>${def.question}</p></div>
          <div class="suspect-matrix-rule"><b>Как работать с ячейкой</b><span>Выберите только те материалы, которые вместе действительно позволяют оценить этот пункт. Не каждая подозрительная улика относится к выбранному критерию.</span></div>
          <div class="case-materials-head"><div><span class="tiny-label">ДОСТУПНЫЕ МАТЕРИАЛЫ</span><h3>Что относится к этому вопросу?</h3></div><small>до 3 материалов</small></div>
          <div class="case-material-grid suspect-matrix-materials">${cards||'<div class="investigation-empty">Подходящие материалы еще не найдены. Продолжайте осмотр и допросы.</div>'}</div>
          <div class="investigation-selection-summary">Выбрано материалов: <b id="matrixSelectedCount">0/3</b></div>
          <button id="checkMatrixCell" class="primary investigation-verify" disabled>Проверить ячейку</button>
          <div id="matrixFeedback" class="investigation-feedback"></div>`;
      }

      const matrixFinalHtml=matrixFinalReady?`<div class="case-final-ready matrix-final-ready"><div><small>ИТОГ РАССЛЕДОВАНИЯ</small><b>Все алиби проверены</b><span>Оба этапа исчезновения установлены, книга найдена в семейном архиве и алиби всех подозреваемых проверены. Теперь можно сформулировать окончательную версию событий.</span></div><button class="primary" id="openMatrixFinal">Сформулировать финальную версию</button></div>`:(matrixStoryReady?`<div class="case-final-ready matrix-final-ready matrix-final-locked"><div><small>ФИНАЛ ПОКА ЗАКРЫТ</small><b>Проверьте алиби всех подозреваемых</b><span>Проверено алиби: ${matrixAlibisDone} из ${matrixAlibiChecks.length}. Осталось: ${matrixAlibisLeft}. Финальная версия откроется после проверки последнего алиби.</span></div></div>`:'');
      $('#caseToolBody').innerHTML=window.DetectivePanels.suspectMatrixHtml({
        columns:suspectMatrixColumns,
        rows,
        finalHtml:matrixFinalHtml,
        detailHtml:detail,
        headingTitle:'Кто действительно мог быть причастен?',
        headingText:'Сравнивайте персонажей по четырем независимым критериям. Один мотив еще не делает человека виновным, а отсутствие алиби не доказывает кражу.'
      });

      const updateMatrixSelectionUi=()=>{
        $$('[data-matrix-fact]').forEach(b=>{
          const sel=matrixSelection.includes(b.dataset.matrixFact);
          b.classList.toggle('selected',sel);
          const em=b.querySelector('em'); if(em) em.textContent=sel?'✓':'';
        });
        const count=$('#matrixSelectedCount'); if(count) count.textContent=`${matrixSelection.length}/3`;
        const check=$('#checkMatrixCell'); if(check) check.disabled=matrixSelection.length<1;
      };

      $$('[data-matrix-cell]').forEach(b=>b.addEventListener('click',()=>{
        state.suspectMatrixActiveCell=b.dataset.matrixCell;
        save();
        renderSuspectMatrix(true);
      }));
      $$('[data-matrix-fact]').forEach(b=>b.addEventListener('click',()=>{
        const key=b.dataset.matrixFact;
        if(matrixSelection.includes(key)) matrixSelection=matrixSelection.filter(x=>x!==key);
        else if(matrixSelection.length<3) matrixSelection.push(key);
        else{
          const box=$('#matrixFeedback');
          if(box) box.innerHTML='<div class="investigation-feedback-partial"><b>Не больше трех материалов.</b><span>Уберите один материал и выберите только факты, которые относятся к этой ячейке.</span></div>';
        }
        updateMatrixSelectionUi();
      }));
      $('#checkMatrixCell')?.addEventListener('click',()=>{
        const match=(def.routes||[]).find(r=>{
          const req=r.requires||[];
          return req.every(k=>matrixSelection.includes(k)) && matrixSelection.every(k=>req.includes(k));
        });
        const box=$('#matrixFeedback');
        if(!match){
          state.deductionAttempts=(state.deductionAttempts||0)+1;
          if(box) box.innerHTML='<div class="investigation-feedback-fail"><b>Эти материалы не позволяют надежно оценить ячейку.</b><span>Проверьте, отвечают ли выбранные факты именно на вопрос о мотиве, доступе, возможности или алиби.</span></div>';
          save();
          return;
        }
        if(match.deductionId && !deductionSatisfied(match.deductionId)){
          pushDeductionHistory(match.requires,'matrix',true,match.deductionId);
          addDeduction(match.deductionId);
        }
        state.suspectMatrixResults[activeKey]={status:match.status,label:match.label,result:match.result,explanation:match.explanation};
        save(); updateInvestigationDock(); renderSuspectMatrix(true);
      });
      $('#recheckMatrixCell')?.addEventListener('click',()=>{
        delete state.suspectMatrixResults[activeKey];
        save(); renderSuspectMatrix(true);
      });
      $('#openMatrixFinal')?.addEventListener('click',renderFinal);
      if(scrollState){ restoreCaseToolScroll(scrollState); requestAnimationFrame(()=>restoreCaseToolScroll(scrollState)); }
      else window.DetectivePanels.resetMatrixViewport($('#caseToolBody'));
    }


    function renderReconstruction(preserveScroll=false){
      const scrollState=preserveScroll?captureCaseToolScroll():null;
      state.reconstructionSelections ||= {};
      state.reconstructionConfirmed ||= [];
      let activeId=state.reconstructionActiveStage||'';
      const isUnlocked=stage=>!(stage.unlockAny||[]).length || (stage.unlockAny||[]).some(investigationFactAvailable);
      const unlocked=reconstructionStages.filter(isUnlocked);
      if(!activeId || !unlocked.some(s=>s.id===activeId)){
        activeId=(unlocked.find(s=>!s.solved())||unlocked[unlocked.length-1]||reconstructionStages[0]).id;
        state.reconstructionActiveStage=activeId;
      }
      const stage=reconstructionStages.find(s=>s.id===activeId)||reconstructionStages[0];
      const selection={...(state.reconstructionSelections[stage.id]||{})};
      let feedback='';

      const factLabel=key=>{
        const f=factMap.get(key);
        if(f) return f.title;
        if(key.startsWith('d:')) return deductionDefs[key.slice(2)]?.name||key;
        return key;
      };
      const known=(stage.known||[]).filter(investigationFactAvailable);
      const confirmedCount=reconstructionStages.filter(s=>s.solved()).length;
      const stageCards=reconstructionStages.map(st=>{
        const unlockedStage=isUnlocked(st);
        const solved=st.solved();
        const active=st.id===stage.id;
        return `<button class="case-reconstruction-stage ${active?'active':''} ${solved?'solved':''} ${unlockedStage?'':'locked'}" data-reconstruction-stage="${st.id}" ${unlockedStage?'':'disabled'}>
          <span class="case-reconstruction-stage-no">${solved?'✓':st.number}</span>
          <span><small>${unlockedStage?st.moment:'Этап '+st.number}</small><b>${unlockedStage?st.title:'Пока недостаточно данных'}</b></span>
        </button>`;
      }).join('');

      const fieldHtml=stage.fields.map(field=>{
        const current=selection[field.id]||'';
        return `<section class="case-reconstruction-field"><div class="case-reconstruction-field-label">${field.label}</div><div class="case-reconstruction-options">${field.options.map(([id,text])=>`<button class="case-reconstruction-option ${current===id?'selected':''}" data-reconstruction-field="${field.id}" data-reconstruction-value="${id}">${text}</button>`).join('')}</div></section>`;
      }).join('');
      const previewParts=stage.fields.map(field=>{
        const val=selection[field.id];
        const opt=field.options.find(o=>o[0]===val);
        return `<span class="${opt?'filled':''}">${opt?opt[1]:field.label}</span>`;
      }).join('<i>→</i>');
      const allSelected=stage.fields.every(f=>selection[f.id]);
      const solved=stage.solved();
      const knownHtml=known.length?known.map(k=>`<span>${factLabel(k)}</span>`).join(''):'<em>Для этого этапа пока нет достаточных материалов.</em>';

      $('#caseToolBody').innerHTML=`<div class="case-reconstruction-layout">
        <aside class="case-reconstruction-stage-list">
          <div class="case-side-head"><span class="tiny-label">РЕКОНСТРУКЦИЯ</span><h3>Соберите ход преступления</h3><p>Не выбирайте готовый вывод. Соберите каждый этап из отдельных частей.</p></div>
          <div class="case-reconstruction-progress"><b>${confirmedCount}/${reconstructionStages.length}</b><span>этапов подтверждено</span></div>
          ${stageCards}
        </aside>
        <section class="case-reconstruction-main">
          <div class="case-tool-heading"><span class="tiny-label">ЭТАП ${stage.number} · ${stage.moment}</span><h2>${stage.title}</h2><p>Соберите наиболее логичную сцену из доступных вариантов. Затем игра проверит, хватает ли найденных материалов, чтобы считать ее доказанной.</p></div>
          <div class="case-reconstruction-known"><span class="tiny-label">ЧТО УЖЕ ИЗВЕСТНО</span><div>${knownHtml}</div></div>
          ${solved?`<div class="case-reconstruction-confirmed"><span>✓</span><div><small>ЭТАП ПОДТВЕРЖДЕН</small><b>${stage.result}</b><p>Этот фрагмент теперь считается установленным событием расследования.</p></div></div>`:`
            <div class="case-reconstruction-builder">${fieldHtml}</div>
            <div class="case-reconstruction-preview"><small>ВАША РЕКОНСТРУКЦИЯ</small><div>${previewParts}</div></div>
            <button id="checkReconstructionStage" class="primary case-reconstruction-check" ${allSelected?'':'disabled'}>Проверить этот этап</button>
            <div id="reconstructionFeedback" class="investigation-feedback"></div>`}
        </section>
      </div>`;

      $$('[data-reconstruction-stage]').forEach(b=>b.addEventListener('click',()=>{
        state.reconstructionActiveStage=b.dataset.reconstructionStage;
        save();
        renderReconstruction(true);
      }));
      $$('[data-reconstruction-field]').forEach(b=>b.addEventListener('click',()=>{
        const fid=b.dataset.reconstructionField;
        state.reconstructionSelections[stage.id] ||= {};
        state.reconstructionSelections[stage.id][fid]=b.dataset.reconstructionValue;
        save();
        renderReconstruction(true);
      }));
      $('#checkReconstructionStage')?.addEventListener('click',()=>{
        const chosen=state.reconstructionSelections[stage.id]||{};
        const answerOk=Object.entries(stage.answer).every(([k,v])=>chosen[k]===v);
        const box=$('#reconstructionFeedback');
        if(!answerOk){
          state.deductionAttempts=(state.deductionAttempts||0)+1;
          if(box) box.innerHTML='<div class="investigation-feedback-fail"><b>Эта сцена не согласуется с собранными фактами.</b><span>Посмотрите на показания, время камер и места, где персонажи действительно могли находиться.</span></div>';
          save();
          return;
        }
        const route=(stage.routes||[]).find(r=>(r.requires||[]).every(investigationFactAvailable));
        if(!route){
          if(box) box.innerHTML='<div class="investigation-feedback-partial"><b>Реконструкция выглядит возможной, но пока не доказана.</b><span>Для этого этапа не хватает независимых подтверждений. Продолжайте осмотр и допросы, затем вернитесь сюда.</span></div>';
          return;
        }
        (route.also||[]).forEach(id=>{ if(!deductionSatisfied(id)) addDeduction(id); });
        if(route.deductionId && !deductionSatisfied(route.deductionId)){
          pushDeductionHistory(route.requires,'reconstruction',true,route.deductionId);
          addDeduction(route.deductionId);
        }
        if(!state.reconstructionConfirmed.includes(stage.id)) state.reconstructionConfirmed.push(stage.id);
        const next=reconstructionStages.find(st=>isUnlocked(st)&&!st.solved());
        if(next) state.reconstructionActiveStage=next.id;
        save(); updateInvestigationDock(); renderReconstruction(true);
      });
      if(scrollState){ restoreCaseToolScroll(scrollState); requestAnimationFrame(()=>restoreCaseToolScroll(scrollState)); }
    }

    function renderVersions(preserveScroll=false){
      const scrollState=preserveScroll?captureCaseToolScroll():null;
      const available=versionDefs.filter(versionAvailable);
      if(!activeVersionId || !available.some(v=>v.id===activeVersionId)){
        activeVersionId=(available.find(versionReady)||available.find(v=>!versionSolved(v))||available[0]||{}).id||'';
        selectedRouteId=''; versionSelection=[]; versionFeedback='';
      }
      const current=available.find(v=>v.id===activeVersionId);
      const list=v=>`<button class="case-version-card ${v.id===activeVersionId?'active':''} ${versionSolved(v)?'solved':''} ${versionReady(v)?'ready':''}" data-version-id="${v.id}">
        <span>${versionSolved(v)?'✓':versionReady(v)?'!':'?'}</span>
        <div><b>${v.title}</b><small>${versionSolved(v)?'Доказано':versionReady(v)?'Можно попытаться проверить':'Нужны дополнительные материалы'}</small></div>
      </button>`;
      const main=available.filter(v=>v.group==='main').map(list).join('')||'<div class="investigation-empty">Основные версии еще не открыты.</div>';
      const optional=available.filter(v=>v.group==='optional').map(list).join('')||'<div class="investigation-empty">Дополнительных версий пока нет.</div>';

      let workspace='<div class="investigation-empty">Соберите первые материалы дела, чтобы появились проверяемые версии.</div>';
      if(current){
        const solved=versionSolved(current);
        const routes=current.routes||[];
        if(!selectedRouteId || !routes.some(r=>r.id===selectedRouteId)) selectedRouteId=(routes.find(routeReady)||routes[0]||{}).id||'';
        const route=routes.find(r=>r.id===selectedRouteId);
        const routeTabs=routes.length>1?`<div class="case-proof-routes">${routes.map(r=>`<button class="${r.id===selectedRouteId?'active':''} ${routeReady(r)?'ready':''}" data-route-id="${r.id}">${r.label}</button>`).join('')}</div>`:'';
        const conditions=route?`<div class="case-proof-conditions"><span class="tiny-label">ЧТО ДОЛЖНО БЫТЬ ДОКАЗАНО</span>${route.conditions.map((c,i)=>`<div><i>${i+1}</i><span>${c}</span></div>`).join('')}</div>`:'';
        const materials=facts.map(f=>materialCard(f,versionSelection.includes(f.key))).join('');
        const solvedDeduction=deductionDefs[current.solved];
        workspace=`
          <div class="case-version-workspace">
            <div class="case-tool-heading"><span class="tiny-label">ПРОВЕРКА ВЕРСИИ</span><h2>${current.title}</h2><p>${current.desc}</p></div>
            ${solved?`<div class="investigation-proved"><span>✓</span><div><small>ДОКАЗАНО</small><b>${solvedDeduction?.name||current.title}</b><p>${solvedDeduction?.desc||''}</p></div></div>`:`
              ${routeTabs}
              ${conditions}
              <div class="case-materials-head"><div><span class="tiny-label">МАТЕРИАЛЫ ДЕЛА</span><h3>Какие материалы закрывают эти условия?</h3></div><small>Выберите до 3</small></div>
              <div class="case-material-grid">${materials||'<div class="investigation-empty">Материалы пока не собраны.</div>'}</div>
              <div class="investigation-selection-summary">Выбрано материалов: <b>${versionSelection.length}/3</b></div>
              <button id="verifyCaseVersion" class="primary investigation-verify" ${versionSelection.length<2?'disabled':''}>Проверить доказательства</button>
              <div class="investigation-feedback">${versionFeedback}</div>`}
          </div>`;
      }

      $('#caseToolBody').innerHTML=`<div class="case-versions-layout">
        <aside class="case-version-list"><div class="case-side-head"><span class="tiny-label">ВЕРСИИ ДЕЛА</span><h3>Что вы хотите проверить?</h3><p>Версия появляется, когда в деле возникает хотя бы одно основание для нее.</p></div><div class="investigation-group-label">Основная линия</div>${main}<div class="investigation-group-label">Дополнительные линии</div>${optional}</aside>
        <section class="case-version-main">${workspace}</section>
      </div>`;

      $$('[data-version-id]').forEach(b=>b.addEventListener('click',()=>{
        // Переключение версии перерисовывает весь блок. Сохраняем позицию
        // левой колонки отдельно, чтобы список «Версии дела» не прыгал вверх.
        const versionList=$('#caseToolBody')?.querySelector('.case-version-list');
        const listScrollTop=versionList?.scrollTop||0;
        const listScrollLeft=versionList?.scrollLeft||0;
        activeVersionId=b.dataset.versionId;
        selectedRouteId='';
        versionSelection=[];
        versionFeedback='';
        renderVersions(false);
        const restoreVersionList=()=>{
          const list=$('#caseToolBody')?.querySelector('.case-version-list');
          if(!list) return;
          list.scrollTop=listScrollTop;
          list.scrollLeft=listScrollLeft;
        };
        restoreVersionList();
        requestAnimationFrame(()=>{ restoreVersionList(); requestAnimationFrame(restoreVersionList); });
      }));
      $$('[data-route-id]').forEach(b=>b.addEventListener('click',()=>{ selectedRouteId=b.dataset.routeId; versionSelection=[]; versionFeedback=''; renderVersions(true); }));
      $$('[data-version-fact]').forEach(b=>b.addEventListener('click',()=>{
        const key=b.dataset.versionFact;
        if(versionSelection.includes(key)) versionSelection=versionSelection.filter(x=>x!==key);
        else if(versionSelection.length<3) versionSelection.push(key);
        else versionFeedback='<div class="investigation-feedback-partial"><b>Можно выбрать не больше трех материалов.</b><span>Уберите один материал и попробуйте снова.</span></div>';
        renderVersions(true);
      }));
      $('#verifyCaseVersion')?.addEventListener('click',()=>{
        const v=versionDefs.find(x=>x.id===activeVersionId);
        const r=(v?.routes||[]).find(x=>x.id===selectedRouteId);
        if(!v||!r) return;
        if(sameFactSet(versionSelection,r.requires)){
          const d=deductionDefs[r.deductionId];
          pushDeductionHistory(versionSelection,d?.relation||'investigation',true,r.deductionId);
          addDeduction(r.deductionId);
          versionFeedback=`<div class="investigation-feedback-success"><b>Версия выдержала проверку</b><span>${d?.name||v.title}</span><small>${relationName(d?.relation)}</small></div>`;
          versionSelection=[];
          save(); updateInvestigationDock(); renderVersions(true);
        }else{
          state.deductionAttempts=(state.deductionAttempts||0)+1;
          const subset=versionSelection.every(k=>(r.requires||[]).includes(k));
          versionFeedback=subset
            ? '<div class="investigation-feedback-partial"><b>Направление верное, но цепочка неполная.</b><span>Одно из условий этой версии еще не подтверждено выбранными материалами.</span></div>'
            : '<div class="investigation-feedback-fail"><b>Эти материалы не образуют доказательство версии.</b><span>Сверьтесь с условиями выше: каждый выбранный материал должен подтверждать одно из них.</span></div>';
          save(); renderVersions(true);
        }
      });
      if(scrollState){ restoreCaseToolScroll(scrollState); requestAnimationFrame(()=>restoreCaseToolScroll(scrollState)); }
    }

    function getTimelineEvents(){ return timelineDefs.filter(e=>e.available()); }
    function ensureTimelineOrder(events){
      state.investigationTimelineOrder=Array.isArray(state.investigationTimelineOrder)?state.investigationTimelineOrder:[];
      const ids=new Set(events.map(e=>e.id));
      let order=state.investigationTimelineOrder.filter(id=>ids.has(id));
      const fresh=events.filter(e=>!order.includes(e.id)).sort((a,b)=>((a.rank*7)%13)-((b.rank*7)%13));
      order.push(...fresh.map(e=>e.id));
      state.investigationTimelineOrder=order;
      save();
      return order;
    }

    function renderTimelineTool(preserveScroll=false){
      const scrollState=preserveScroll?captureCaseToolScroll():null;
      const events=getTimelineEvents();
      const order=ensureTimelineOrder(events);
      const byId=new Map(events.map(e=>[e.id,e]));
      const cards=order.map((id,i)=>{
        const e=byId.get(id); if(!e) return '';
        return `<div class="case-timeline-card" data-timeline-id="${id}">
          <div class="case-timeline-pos">${i+1}</div>
          <div><small>${e.time}</small><b>${e.text}</b></div>
          <div class="case-timeline-move"><button data-timeline-up="${id}" ${i===0?'disabled':''}>↑</button><button data-timeline-down="${id}" ${i===order.length-1?'disabled':''}>↓</button></div>
        </div>`;
      }).join('');
      const finalReady=deductionReadyForFinal() && deductionSatisfied('twoStages');
      $('#caseToolBody').innerHTML=`<div class="case-timeline-tool">
        <div class="case-tool-heading"><span class="tiny-label">ХРОНОЛОГИЯ</span><h2>Восстановите порядок событий</h2><p>Здесь нет готового вывода. Расставьте уже установленные события от раннего к позднему. Новые карточки появляются по мере расследования.</p></div>
        <div class="case-timeline-board">${cards||'<div class="investigation-empty">Пока недостаточно установленных событий для хронологии.</div>'}</div>
        ${events.length>=2?'<div class="case-timeline-actions"><button id="checkTimeline" class="primary">Проверить последовательность</button><button id="resetTimeline">Сбросить порядок</button></div>':''}
        <div class="investigation-feedback">${timelineFeedback}</div>
        ${finalReady?'<div class="case-final-ready"><b>Полная последовательность установлена.</b><button class="primary" id="openFinal">Сформулировать финальную версию</button></div>':''}
      </div>`;
      $$('[data-timeline-up]').forEach(b=>b.addEventListener('click',()=>{
        const id=b.dataset.timelineUp, i=state.investigationTimelineOrder.indexOf(id); if(i>0){[state.investigationTimelineOrder[i-1],state.investigationTimelineOrder[i]]=[state.investigationTimelineOrder[i],state.investigationTimelineOrder[i-1]];save();renderTimelineTool(true);}
      }));
      $$('[data-timeline-down]').forEach(b=>b.addEventListener('click',()=>{
        const id=b.dataset.timelineDown, i=state.investigationTimelineOrder.indexOf(id); if(i>=0&&i<state.investigationTimelineOrder.length-1){[state.investigationTimelineOrder[i+1],state.investigationTimelineOrder[i]]=[state.investigationTimelineOrder[i],state.investigationTimelineOrder[i+1]];save();renderTimelineTool(true);}
      }));
      $('#resetTimeline')?.addEventListener('click',()=>{ state.investigationTimelineOrder=[];timelineFeedback='';save();renderTimelineTool(true); });
      $('#checkTimeline')?.addEventListener('click',()=>{
        const current=state.investigationTimelineOrder.map(id=>byId.get(id)).filter(Boolean);
        const ok=current.every((e,i)=>i===0||current[i-1].rank<e.rank);
        if(ok){
          if(deductionSatisfied('viktorHidBook')&&deductionSatisfied('marinaMovedBook')&&state.evidence.includes('foundBook')){
            if(!deductionSatisfied('twoStages')) addDeduction('twoStages');
            timelineFeedback='<div class="investigation-feedback-success"><b>Хронология восстановлена</b><span>Теперь видно, что исчезновение состояло из двух отдельных этапов: сначала действия Виктора, затем действия Марины.</span></div>';
          }else{
            timelineFeedback='<div class="investigation-feedback-success"><b>Порядок известных событий верный</b><span>Но в цепочке пока есть пробелы. Продолжайте расследование и возвращайтесь сюда после новых находок.</span></div>';
          }
        }else{
          timelineFeedback='<div class="investigation-feedback-fail"><b>В последовательности есть нестыковка.</b><span>Сверьте точное время на камерах и события, которые должны были произойти до или после них.</span></div>';
        }
        save(); updateInvestigationDock(); renderTimelineTool(true);
      });
      $('#openFinal')?.addEventListener('click',renderFinal);
      if(scrollState){ restoreCaseToolScroll(scrollState); requestAnimationFrame(()=>restoreCaseToolScroll(scrollState)); }
    }

    function renderContradictions(preserveScroll=false){
      const scrollState=preserveScroll?captureCaseToolScroll():null;
      const statements=facts.filter(f=>f.kind==='Показание');
      const evidence=facts.filter(f=>f.kind==='Улика');
      const solved=deductionSatisfied('marinaKnewSafe');
      $('#caseToolBody').innerHTML=`<div class="case-contradiction-tool">
        <div class="case-tool-heading"><span class="tiny-label">ПРОТИВОРЕЧИЯ</span><h2>Слова против фактов</h2><p>Выберите одно показание и одну улику. Если они не могут быть одновременно правдой, вы получите новый установленный факт.</p></div>
        ${solved?'<div class="case-established-contradiction"><span>✓</span><div><small>УСТАНОВЛЕННОЕ ПРОТИВОРЕЧИЕ</small><b>Марина заранее знала о сейфе</b><p>Ее отрицание не согласуется со старой фотографией у семейного сейфа.</p></div></div>':''}
        <div class="case-contradiction-columns">
          <section><div class="case-materials-head"><div><span class="tiny-label">ПОКАЗАНИЯ</span><h3>Что сказал персонаж?</h3></div></div><div class="case-contradiction-list">${statements.map(f=>materialCard(f,contradictionStatement===f.key,'data-contradiction-statement')).join('')||'<div class="investigation-empty">Показаний пока нет.</div>'}</div></section>
          <div class="case-contradiction-vs">↔</div>
          <section><div class="case-materials-head"><div><span class="tiny-label">УЛИКИ</span><h3>Какой факт этому противоречит?</h3></div></div><div class="case-contradiction-list">${evidence.map(f=>materialCard(f,contradictionEvidence===f.key,'data-contradiction-evidence')).join('')||'<div class="investigation-empty">Улик пока нет.</div>'}</div></section>
        </div>
        <button id="checkContradiction" class="primary case-contradiction-check" ${!contradictionStatement||!contradictionEvidence?'disabled':''}>Проверить противоречие</button>
        <div class="investigation-feedback">${contradictionFeedback}</div>
      </div>`;
      $$('[data-contradiction-statement]').forEach(b=>b.addEventListener('click',()=>{contradictionStatement=b.dataset.contradictionStatement;contradictionFeedback='';renderContradictions(true);}));
      $$('[data-contradiction-evidence]').forEach(b=>b.addEventListener('click',()=>{contradictionEvidence=b.dataset.contradictionEvidence;contradictionFeedback='';renderContradictions(true);}));
      $('#checkContradiction')?.addEventListener('click',()=>{
        const match=contradictionDefs.find(c=>c.statement===contradictionStatement&&c.evidence===contradictionEvidence);
        if(match){
          addDeduction(match.deductionId);
          pushDeductionHistory([contradictionStatement,contradictionEvidence],'contradiction',true,match.deductionId);
          contradictionFeedback=`<div class="investigation-feedback-success"><b>Противоречие установлено</b><span>${match.result}</span><small>${match.explanation}</small></div>`;
          contradictionStatement=''; contradictionEvidence=''; save(); updateInvestigationDock(); renderContradictions(true);
        }else{
          contradictionFeedback='<div class="investigation-feedback-fail"><b>Прямого противоречия нет.</b><span>Эти два материала могут существовать одновременно или относятся к разным обстоятельствам. Попробуйте другую пару.</span></div>';
          state.deductionAttempts=(state.deductionAttempts||0)+1; save(); renderContradictions(true);
        }
      });
      if(scrollState){ restoreCaseToolScroll(scrollState); requestAnimationFrame(()=>restoreCaseToolScroll(scrollState)); }
    }

    function renderTool(){
      activeTool='matrix';
      $$('.case-tool-tab').forEach(b=>b.classList.toggle('active',b.dataset.caseTool==='matrix'));
      renderSuspectMatrix();
    }

    $$('.case-tool-tab').forEach(b=>b.addEventListener('click',()=>{activeTool='matrix';renderTool();}));

    renderTool();
    updateInvestigationDock();
  }

  function renderFinal(){
    // Финальная версия недоступна, пока не проверено алиби каждого персонажа.
    // Дополнительно требуем завершенную основную линию и найденную книгу,
    // чтобы старые сохранения или скрытые кнопки не могли открыть финал раньше времени.
    const storyReady=deductionReadyForFinal() && deductionSatisfied('twoStages') && state.evidence.includes('foundBook');
    if(!storyReady || !matrixAllAlibisResolved()){
      renderCase();
      return;
    }
    const html=`<div class="final-form final-form-refactor">
      <div class="final-row"><label>ЧТО СДЕЛАЛ ВИКТОР ПОСЛЕ ДЕМОНСТРАЦИИ?</label><select id="fViktor"><option value="">Выберите...</option><option value="safe">Не вернул книгу в витрину и спрятал ее в сейфе кабинета</option><option value="carry">Вынес книгу из кабинета</option><option value="nothing">Сразу вернул книгу в витрину</option><option value="pavel">Передал книгу Павлу</option></select></div>
      <div class="final-row"><label>КАК МАРИНА МОГЛА ОТКРЫТЬ СЕЙФ?</label><select id="fAccess"><option value="">Выберите...</option><option value="code">Использовала действующий семейный код</option><option value="break">Взломала сейф</option><option value="key">Нашла ключ Виктора</option><option value="help">Виктор открыл ей сейф</option></select></div>
      <div class="final-row"><label>ЧТО ПРОИЗОШЛО ПОСЛЕ ЭТОГО?</label><select id="fMarina"><option value="">Выберите...</option><option value="move">Марина самостоятельно переместила книгу через служебную часть</option><option value="stay">Книга все время оставалась в сейфе</option><option value="liza">Книгу унесла Лиза</option><option value="anton">Книгу забрал Антон</option></select></div>
      <button class="primary" id="submitFinal">Предъявить версию</button>
      <div id="finalResult"></div>
    </div>`;
    openModal('ФИНАЛ','Ваша версия',html);
    $('#modal .modal-shell')?.classList.add('final-modal-shell');
    $('#modalBody')?.classList.add('final-modal-body');
    $('#submitFinal').addEventListener('click',()=>{
      const ok=$('#fViktor').value==='safe' && $('#fAccess').value==='code' && $('#fMarina').value==='move';
      if(!ok){
        $('#finalResult').innerHTML=`<div class="card" style="border-color:rgba(190,80,80,.55)"><h3>Версия не сходится</h3><p>Сверьте три обязательных ядра: первый этап в кабинете Виктора, доступ Марины к сейфу и ее последующее перемещение книги.</p></div>`;
        return;
      }
      state.flags.ending=true; save();
      const extra=[];
      if(state.deductions.includes('viktorFinancialMotive')) extra.push('<p><b>Финансовая ветка.</b> Повышенная страховка и документы ресторана подтверждают, что у Виктора был финансовый интерес к созданию страхового случая.</p>');
      if(state.deductions.includes('marinaFamilyMotive')) extra.push('<p><b>Семейная ветка.</b> Слова Марины и документы архива подтверждают, что она воспринимала книгу как общую семейную реликвию и выступала против контроля Виктора.</p>');
      if(state.deductions.includes('pavelLizaDeal')) extra.push('<p><b>Павел и Лиза.</b> Их тайная сделка действительно существовала, но касалась фотографий отдельных страниц, а не исчезновения всей книги.</p>');
      if(state.deductions.includes('antonOldCopy')) extra.push('<p><b>Антон.</b> Его скрытая копия рецепта оказалась старой и не относилась к нынешнему исчезновению.</p>');
      if(state.deductions.includes('dmitryHistory')) extra.push('<p><b>Дмитрий.</b> Его интерес объясняется историей отца и семейного архива.</p>');
      const found=state.evidence.includes('foundBook')?'<p><b>Физическое подтверждение.</b> Книга найдена в семейном архиве, завернутой в льняную ткань.</p>':'';
      $('#submitFinal')?.remove();
      $('#finalResult').innerHTML=`<div class="ending"><h3>Дело раскрыто</h3><p><b>Первый этап.</b> После демонстрации Виктор не вернул семейную книгу в витрину. Книга некоторое время лежала на его столе, после чего он спрятал ее в сейфе в собственном кабинете. Виктор покинул кабинет без книги.</p><p><b>Второй этап.</b> Марина знала семейный код и могла открыть сейф без взлома. После этого она переместила книгу через служебную часть ресторана.</p><p><b>Главный вывод.</b> Исчезновение состояло из двух отдельных действий: сначала Виктор создал видимость пропажи, затем Марина самостоятельно забрала уже спрятанную книгу.</p>${found}${extra.join('')}<div class="ending-actions"><button class="primary" data-final-action="stories">Вернуться к историям</button><button data-final-action="restart">Пройти дело заново</button></div></div>`;
      $$('[data-final-action]').forEach(b=>b.addEventListener('click',()=>{
        if(b.dataset.finalAction==='stories'){ closeModal(); showScreen('#menuScreen'); }
        else { localStorage.removeItem(SAVE_KEY); location.reload(); }
      }));
    });
  }

  const interrogationEvidenceReactions = {};

  const interrogationChains = {};


  function getInterrogationEvidenceIds(){
    const ids=[];
    state.evidence.forEach(id=>{ if(evidenceDefs[id]) ids.push(id); });
    state.statements.forEach(id=>{ if(evidenceDefs[id] && !ids.includes(id)) ids.push(id); });
    return ids;
  }

  function rememberInterrogationNote(note){
    if(note && !state.notes.includes(note)) state.notes.push(note);
  }

  function recordCaseStatement(id){
    if(!id || !evidenceDefs[id]) return false;
    if(!state.statements.includes(id)){
      state.statements.push(id);
      return true;
    }
    return false;
  }

  function interrogationProgressKey(sid,tid){ return `${sid}:${tid}`; }

  function getInterrogationProgress(sid,tid){
    state.interrogationProgress ||= {};
    const key=interrogationProgressKey(sid,tid);
    state.interrogationProgress[key] ||= {stage:1};
    if(sid==='viktor' && tid==='book'){
      const dustAlreadyPresented = Object.values(state.talks?.viktor || {}).some(entry=>
        entry?.presented?.includes('dustMark') || entry?.lastPresentation?.evidence==='dustMark'
      );
      const dustStageResolved = dustAlreadyPresented
        || (state.deductions||[]).includes('bookOnDesk')
        || (state.deductions||[]).includes('viktorMovedBook')
        || (state.deductions||[]).includes('blackoutDecoy')
        || !!state.talks?.viktor?.insurance
        || !!state.talks?.viktor?.money
        || (state.deductions||[]).includes('viktorFinancialMotive')
        || (state.deductions||[]).includes('marinaKnewSafe')
        || (state.deductions||[]).includes('marinaAccess');
      if(dustStageResolved && (state.interrogationProgress[key].stage||0)<2){
        state.interrogationProgress[key].stage=2;
        state.interrogationProgress[key].pressureEvidence='dustMark';
      }
    }
    return state.interrogationProgress[key];
  }

  function ensureCurrentTopic(){
    if(currentTopic || !currentSuspect) return currentTopic;
    const savedId=state.activeInterrogationTopics?.[currentSuspect];
    if(!savedId) return null;
    const topic=suspects[currentSuspect]?.topics.find(t=>t.id===savedId);
    if(topic) currentTopic=topic;
    return currentTopic;
  }

  function getCurrentInterrogationChain(){
    ensureCurrentTopic();
    if(!currentSuspect || !currentTopic) return null;
    return interrogationChains[currentSuspect]?.[currentTopic.id] || null;
  }

  function renderInterrogationStages(){
    ensureCurrentTopic();
    const steps=$$('[data-interrogation-step]');
    if(!steps.length) return;
    const chain=getCurrentInterrogationChain();
    const simpleMode=currentTopic && (currentTopic.mode==='witness' || currentTopic.mode==='context');
    activeInterrogationChain=chain;
    const progress=currentTopic ? getInterrogationProgress(currentSuspect,currentTopic.id) : {stage:0};
    const stage=currentTopic ? (progress.stage||1) : 0;
    const isContradiction=chain?.stage3Label==='Противоречие';
    const stagesBox=$('#interrogationStages');
    if(stagesBox) stagesBox.style.display='none';
    if(simpleMode){
      steps.forEach(el=>{el.classList.remove('active','locked');el.classList.add('done')});
      const hint=$('#interrogationStageHint');
      if(hint) hint.textContent='Показание зафиксировано как материал дела. Используйте его в дальнейшей дедукции, если оно связано с текущей цепочкой.';
      return;
    }

    steps.forEach(el=>{
      const n=Number(el.dataset.interrogationStep);
      el.classList.toggle('done',stage>n || (n===3 && stage>=3));
      el.classList.toggle('active',stage===n || (n===1 && stage===1));
      el.classList.toggle('locked',n===3 && (!chain || !chain.stage3Proof));
    });

    const stage1Label=document.querySelector('[data-interrogation-step="1"] span');
    const stage2Label=document.querySelector('[data-interrogation-step="2"] span');
    const stage3Label=$('#interrogationStage3Label');
    if(stage1Label) stage1Label.textContent='Получить версию';
    if(stage2Label) stage2Label.textContent='Проверить уликой';
    if(stage3Label) stage3Label.textContent=isContradiction?'Найти противоречие':'Проверить версию';

    const hint=$('#interrogationStageHint');
    if(hint){
      if(!currentTopic){
        hint.textContent='Выберите тему разговора, чтобы получить исходную версию собеседника.';
      } else if(stage>=3){
        hint.textContent='Линия допроса завершена. Полученный вывод можно использовать при проверке версий в разделе «Расследование».';
      } else if(stage>=2){
        if(chain?.openArchiveAtStage2 && !state.evidence.includes('oldPhoto')){
          hint.textContent='Собеседник изменил показание. Новая зацепка открыла семейный архив — найдите там независимый материал и вернитесь к проверке версии.';
        } else {
          hint.textContent=isContradiction
            ? 'Появилась новая версия. Когда найдется проверяющий факт, откроется следующий вопрос.'
            : 'Появилась новая версия. Когда найдется подтверждение, откроется следующий вопрос.';
        }
      } else {
        hint.textContent='Продолжайте расследование. Когда появится новая зацепка, в темах разговора откроется новый вопрос.';
      }
    }
  }

  function restoreCurrentTopicState(){
    if(!currentTopic) return;
    const simpleMode=currentTopic.mode==='witness' || currentTopic.mode==='context';
    const chain=getCurrentInterrogationChain();
    if(simpleMode){
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker final">ПОКАЗАНИЕ ЗАФИКСИРОВАНО</span>${currentTopic.text}`;
      $('#checkStatementBtn')?.classList.add('hidden');
      renderInterrogationStages();
      return;
    }
    const progress=getInterrogationProgress(currentSuspect,currentTopic.id);
    if(chain && progress.stage>=3){
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker final">${chain.stage3Label==='Признание'?'ПРИЗНАНИЕ ПОЛУЧЕНО':chain.stage3Label==='Противоречие'?'ВЕРСИЯ ПОСТАВЛЕНА ПОД СОМНЕНИЕ':'ВЕРСИЯ ПРОВЕРЕНА'}</span>${chain.stage3Text}`;
      if(chain.stage3Mood) $('#suspectMood').textContent=chain.stage3Mood;
      currentStatement=null;
      $('#checkStatementBtn')?.classList.add('hidden');
    } else if(chain && progress.stage>=2){
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker">ВЕРСИЯ ИЗМЕНИЛАСЬ</span>${chain.pressureText}`;
      if(chain.pressureMood) $('#suspectMood').textContent=chain.pressureMood;
      currentStatement={text:chain.pressureText,chain:true};
      const check=$('#checkStatementBtn');
      if(check) check.classList.add('hidden');
      const proofAvailable=false;
      if(proofAvailable){
        check.textContent='Проверить новую версию';
        check.classList.remove('hidden');
      } else if(check) check.classList.add('hidden');
    } else {
      $('#dialogueText').textContent=currentTopic.text;
      currentStatement=null;
      $('#checkStatementBtn')?.classList.add('hidden');
    }
    renderInterrogationStages();
  }

  function renderInterrogationEvidence(){
    ensureCurrentTopic();
    const box=$('#interrogationEvidenceTray');
    const btn=$('#presentEvidenceBtn');
    const hint=$('#presentEvidenceHint');
    if(!box || !btn || !hint) return;
    const block=box.closest('.cinema-evidence-block');
    const simpleMode=currentTopic && (currentTopic.mode==='witness' || currentTopic.mode==='context');
    const progress=currentTopic ? getInterrogationProgress(currentSuspect,currentTopic.id) : {stage:0};
    if(block) block.style.display=(simpleMode || progress.stage>=3)?'none':'';
    if(simpleMode || progress.stage>=3) return;

    let ids=getInterrogationEvidenceIds();
    const chain=getCurrentInterrogationChain();
    if(currentTopic){
      const relevant=new Set();
      if(chain?.pressureEvidence) relevant.add(chain.pressureEvidence);
      if(chain?.stage3Proof?.startsWith('e:')) relevant.add(chain.stage3Proof.slice(2));
      (chain?.stage3Candidates||[]).filter(k=>k.startsWith('e:')).forEach(k=>relevant.add(k.slice(2)));
      Object.keys(((interrogationEvidenceReactions[currentSuspect]||{})[currentTopic.id]||{})).forEach(id=>relevant.add(id));
      if(relevant.size) ids=ids.filter(id=>relevant.has(id));
    }
    if(!ids.length){
      box.innerHTML='<div class="interrogation-evidence-empty">Для этой темы пока нет подходящего материала.</div>';
      btn.disabled=true;
      hint.textContent='Продолжайте расследование: подходящий материал появится после новой зацепки.';
      return;
    }
    const talkEntry=state.talks?.[currentSuspect]?.[currentTopic?.id] || {};
    const presented=new Set(talkEntry.presented||[]);
    box.innerHTML=ids.map(id=>{
      const e=evidenceDefs[id];
      const active=selectedInterrogationEvidence===id ? ' selected' : '';
      const used=presented.has(id) ? ' used' : '';
      return `<button type="button" class="interrogation-evidence-chip${active}${used}" data-action="select-interrogation-evidence" data-evidence-id="${id}" ${presented.has(id)?'disabled':''}><b>${e.icon}</b><span>${e.name}</span>${presented.has(id)?'<small>Предъявлено</small>':''}</button>`;
    }).join('');
    btn.disabled=!(selectedInterrogationEvidence && currentTopic) || progress.stage>=2 || presented.has(selectedInterrogationEvidence);
    if(!currentTopic) hint.textContent='Сначала выберите тему разговора.';
    else if(progress.stage>=2) hint.textContent=chain?.stage3Proof ? 'Материал предъявлен. Когда будет найден независимый материал для следующей проверки, появится соответствующая кнопка.' : 'Материал уже предъявлен. Эта линия не требует отдельной проверки версии.';
    else if(!selectedInterrogationEvidence) hint.textContent='Показаны только материалы, относящиеся к текущему вопросу.';
    else hint.textContent=`Выбран материал: ${evidenceDefs[selectedInterrogationEvidence].name}. Предъявите его и оцените реакцию собеседника.`;
  }

  const suspectDativeNames = {
    viktor:'Виктору',
    anton:'Антону',
    marina:'Марине',
    pavel:'Павлу',
    liza:'Лизе',
    dmitry:'Дмитрию'
  };

  const evidencePresentationPhrases = {
    emptyCase:{verb:'указываете', object:'на пустую витрину'},
    dustMark:{verb:'обращаете внимание', object:'на след на пыльном столе'},
    insurance:{verb:'показываете', object:'страховой полис'},
    safe:{verb:'указываете', object:'на открытый сейф'},
    copiedRecipe:{verb:'показываете', object:'переписанный рецепт'},
    kitchenLog:{verb:'показываете', object:'старый журнал кухни'},
    camera:{verb:'показываете', object:'снимок с камеры, сделанный в 20:26'},
    lizaPayment:{verb:'показываете', object:'перевод Лизе'},
    recipePhotos:{verb:'показываете', object:'фотографии страниц рецептов'},
    familyCode:{verb:'показываете', object:'запись со старым семейным кодом'},
    oldPhoto:{verb:'показываете', object:'старую фотографию'},
    archiveLetter:{verb:'показываете', object:'письмо из семейного архива'},
    marinaPhrase:{verb:'напоминаете', object:'об оговорке Марины насчет сейфа'},
    marinaSawSafe:{verb:'напоминаете', object:'о признании Марины, что она видела книгу в сейфе'},
    viktorAdmission:{verb:'напоминаете', object:'о признании Виктора, что он вынес книгу'},
    cameraMarina:{verb:'показываете', object:'кадр с камеры 20:34'}
  };

  const topicRelationPhrases = {
    'viktor:book':'его версией о книге рецептов',
    'viktor:insurance':'его объяснением страхового полиса',
    'viktor:money':'его словами о финансовом положении ресторана',
    'viktor:camera':'его объяснением насчет папки на записи',
    'anton:recipe':'его словами о книге рецептов',
    'anton:copy':'его объяснением происхождения переписанного рецепта',
    'anton:marina':'его рассказом об отношениях Марины и Виктора',
    'marina:cabinet':'ее рассказом о том, где она была вечером',
    'marina:family':'ее отношением к книге',
    'marina:safePhrase':'ее мнением о действиях Виктора',
    'marina:knowledge':'ее объяснением того, откуда она знает о сейфе',
    'pavel:visit':'его объяснением того, зачем он пришел',
    'pavel:recipes':'его словами о конкуренции с Виктором',
    'pavel:payment':'его объяснением платежа Лизе',
    'liza:blackout':'ее рассказом о том, что она видела вечером',
    'liza:office':'ее рассказом о событиях перед отключением света',
    'liza:staffRoom':'ее рассказом о том, куда она пошла после этого',
    'liza:money':'ее объяснением происхождения перевода',
    'dmitry:book':'его объяснением того, что привело его на ужин',
    'dmitry:father':'его рассказом об отце и семье Орловых',
    'dmitry:desk':'его рассказом о том, что произошло после демонстрации',
    'dmitry:marina':'его рассказом о том, что еще он заметил'
  };

  function genericEvidenceReaction(topic,evidence,evidenceId){
    const person=suspects[currentSuspect].name.split(' ')[0];
    const dative=suspectDativeNames[currentSuspect] || person;
    const phrase=evidencePresentationPhrases[evidenceId];
    const opening=phrase
      ? `Вы ${phrase.verb} ${dative} ${phrase.object}.`
      : `Вы обращаете внимание ${dative} на улику «${evidence.name}».`;
    const relation=topicRelationPhrases[`${currentSuspect}:${topic.id}`] || `этой темой разговора`;
    const possessive=(currentSuspect==='marina' || currentSuspect==='liza') ? 'ее' : 'его';
    return `${opening} ${person} отвечает, что это не связано с ${relation} и потому не меняет ${possessive} прежнюю позицию.`;
  }

  function presentEvidence(){
    ensureCurrentTopic();
    if(!currentTopic){ toast('Сначала выберите тему разговора'); renderInterrogationEvidence(); return; }
    if(!selectedInterrogationEvidence){
      selectedInterrogationEvidence=state.activeInterrogationEvidence?.[currentSuspect] || $('#interrogationEvidenceTray .interrogation-evidence-chip.selected')?.dataset.evidenceId || null;
    }
    if(!selectedInterrogationEvidence){ toast('Выберите улику или зафиксированное показание'); renderInterrogationEvidence(); return; }

    const chain=getCurrentInterrogationChain();
    const progress=getInterrogationProgress(currentSuspect,currentTopic.id);
    const evidence=evidenceDefs[selectedInterrogationEvidence];
    state.talks[currentSuspect] ||= {};
    state.talks[currentSuspect][currentTopic.id] ||= {text:currentTopic.text,statement:!!currentTopic.statement};
    const talkEntry=state.talks[currentSuspect][currentTopic.id];
    talkEntry.presented ||= [];
    if(!talkEntry.presented.includes(selectedInterrogationEvidence)) talkEntry.presented.push(selectedInterrogationEvidence);

    if(chain && progress.stage<2 && selectedInterrogationEvidence===chain.pressureEvidence){
      progress.stage=2;
      progress.pressureEvidence=selectedInterrogationEvidence;
      talkEntry.lastPresentation={evidence:selectedInterrogationEvidence,success:true,stage:2};
      rememberInterrogationNote(chain.pressureNote);
      if(chain.openArchiveAtStage2){
        state.flags.archiveOpen=true;
        rememberInterrogationNote('После оговорки Марины появилась причина проверить семейный архив и историю сейфа.');
      }
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker">ВЕРСИЯ ИЗМЕНИЛАСЬ</span>${chain.pressureText}`;
      if(chain.pressureMood) $('#suspectMood').textContent=chain.pressureMood;
      currentStatement={text:chain.pressureText,chain:true};
      const check=$('#checkStatementBtn');
      if(check) check.classList.add('hidden');
      const proofAvailable=false;
      if(proofAvailable){
        check.textContent='Проверить новую версию';
        check.classList.remove('hidden');
      } else if(check) check.classList.add('hidden');
      save(); renderDossierMeta(currentSuspect); renderInterrogationStages(); renderInterrogationEvidence(); setObjective();
      toast(chain.openArchiveAtStage2?'Версия изменилась · открыт семейный архив':'Версия собеседника изменилась');
      return;
    }

    const fallback=((interrogationEvidenceReactions[currentSuspect]||{})[currentTopic.id]||{})[selectedInterrogationEvidence];
    if(fallback){
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker">УЛИКА СВЯЗАНА С ТЕМОЙ</span>${fallback.text}`;
      if(fallback.mood) $('#suspectMood').textContent=fallback.mood;
      rememberInterrogationNote(fallback.note);
      talkEntry.lastPresentation={evidence:selectedInterrogationEvidence,success:true,stage:1};
      save(); renderDossierMeta(currentSuspect); renderInterrogationEvidence();
      toast('Реакция получена, но версия не изменилась');
    } else {
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker weak">УЛИКА НЕ МЕНЯЕТ ВЕРСИЮ</span>${genericEvidenceReaction(currentTopic,evidence,selectedInterrogationEvidence)}`;
      talkEntry.lastPresentation={evidence:selectedInterrogationEvidence,success:false,stage:1};
      save(); renderInterrogationEvidence();
      toast('Собеседник не видит связи с текущим вопросом');
    }
  }

  function getStage3Facts(){
    const all=getAvailableFacts().filter(f=>f.kind==='Улика' || f.kind==='Показание');
    const chain=getCurrentInterrogationChain();
    if(!chain) return all;
    const allowed=new Set([chain.stage3Proof,...(chain.stage3Candidates||[])]);
    return allowed.size ? all.filter(f=>allowed.has(f.key)) : all;
  }

  function renderDossierMeta(id){
    const s=suspects[id];
    const statusEl=$('#dossierStatus');
    const lizaExposed=id==='liza' && state.evidence.includes('staffSchedule') && !!state.talks?.liza?.after;
    if(statusEl) statusEl.textContent=lizaExposed ? 'Подозреваемая' : (s.status || 'Свидетель');

    const related=(suspectEvidenceMap[id]||[]).filter(eid=>state.evidence.includes(eid)||state.statements.includes(eid));
    const evidenceBox=$('#dossierEvidence');
    if(evidenceBox){
      evidenceBox.innerHTML=related.length
        ? related.map(eid=>{const e=evidenceDefs[eid];return `<span class="dossier-evidence-chip"><b>${e.icon}</b>${e.name}</span>`}).join('')
        : '<span class="dossier-evidence-empty">Связанные материалы пока не найдены</span>';
    }
    const ec=$('#dossierEvidenceCount');
    if(ec) ec.textContent=`${related.length} найдено`;

    const discussed=state.talks[id] ? Object.keys(state.talks[id]).length : 0;
    const total=s.topics.length || 1;
    const tc=$('#dossierTalkCount');
    if(tc) tc.textContent=`Обсуждено: ${discussed}`;
    const bar=$('#dossierProgressBar');
    if(bar) bar.style.width=`${Math.min(100,discussed/total*100)}%`;
  }

  function openInterrogation(id){
    currentSuspect=id;currentStatement=null;currentTopic=null;selectedInterrogationEvidence=null;activeInterrogationChain=null;
    let savedTopicId=state.activeInterrogationTopics?.[id];
    const savedEvidenceId=state.activeInterrogationEvidence?.[id];
    if(savedEvidenceId && evidenceDefs[savedEvidenceId]) selectedInterrogationEvidence=savedEvidenceId;

    if(savedTopicId) currentTopic=suspects[id]?.topics.find(t=>t.id===savedTopicId) || null;
    const s=suspects[id];
    const interrogation=$('#interrogation');
    interrogation.dataset.case='family-recipe';
    interrogation.dataset.suspect=id;
    $('#suspectSprite').src=s.img;
    $('#suspectSprite').alt=`${s.name} — ${s.role}`;
    const suspectNameParts=(s.name||'').trim().split(/\s+/);
    $('#suspectFirstName').textContent=suspectNameParts.shift() || '';
    $('#suspectLastName').textContent=suspectNameParts.join(' ') || '';
    $('#suspectRole').textContent=s.role;
    $('#suspectMood').textContent=s.mood;
    const bg=$('#interrogationBg');
    const suspectSceneBg = locations[s.loc]?.img;
    if(bg) bg.style.backgroundImage=`url('${suspectSceneBg || locations.office.img}')`;
    $('#dialogueText').textContent='Выберите тему разговора.';
    renderTopics();
    if(currentTopic) restoreCurrentTopicState();
    else renderInterrogationStages();
    renderDossierMeta(id);
    if(!currentTopic) $('#checkStatementBtn')?.classList.add('hidden');
    interrogation.classList.remove('hidden');
  }

  function isTopicAvailable(sid,t){
    if(t.needs && !state.evidence.includes(t.needs) && !state.statements.includes(t.needs)) return false;
    if(t.unlockDeduction && !deductionSatisfied(t.unlockDeduction)) return false;
    if(t.unlockTopic && !state.talks?.[sid]?.[t.unlockTopic]) return false;
    if(t.requires && !t.requires.every(stateHasFact)) return false;
    return true;
  }

  function interrogationFactAvailable(key){
    if(!key) return false;
    if(key.startsWith('e:')){
      const id=key.slice(2);
      return state.evidence.includes(id) || state.statements.includes(id);
    }
    if(key.startsWith('t:')){
      const [,sid,tid]=key.split(':');
      return !!state.talks?.[sid]?.[tid];
    }
    if(key.startsWith('d:')) return deductionSatisfied(key.slice(2));
    return false;
  }

  function dynamicFollowupsFor(sid){
    const out=[];
    const chains=interrogationChains[sid]||{};
    Object.entries(chains).forEach(([tid,chain])=>{
      if(!state.talks?.[sid]?.[tid]) return;
      const progress=getInterrogationProgress(sid,tid);
      if((progress.stage||1)<2 && chain.pressureEvidence && interrogationFactAvailable(`e:${chain.pressureEvidence}`)){
        out.push({kind:'stage2',tid,label:chain.followupLabel||'Уточнить показание',chain});
      } else if((progress.stage||1)>=2 && (progress.stage||1)<3 && chain.stage3Proof && interrogationFactAvailable(chain.stage3Proof)){
        out.push({kind:'stage3',tid,label:chain.stage3Question||chain.stage3Title||'Проверить новую версию',chain});
      }
    });
    return out;
  }

  function renderTopics(){
    const s=suspects[currentSuspect];
    const box=$('#topicList');
    if(!box) return;
    box.innerHTML='';

    const available=s.topics.filter(t=>isTopicAvailable(currentSuspect,t));
    const followups=dynamicFollowupsFor(currentSuspect);

    available.forEach(t=>{
      const b=document.createElement('button');
      b.type='button';
      b.dataset.topicId=t.id;
      const discussed=!!state.talks?.[currentSuspect]?.[t.id];
      const isNew=!discussed && (t.needs || t.unlockDeduction || t.unlockTopic || t.requires);
      b.innerHTML=`<span>${t.label}</span>${isNew?'<small class="topic-new-badge">Новая тема</small>':discussed?'<small class="topic-done-badge">Обсуждено</small>':''}`;
      if(t.pressure)b.classList.add('pressure');
      if(discussed)b.classList.add('discussed-topic');
      if(currentTopic?.id===t.id)b.classList.add('active-topic');
      b.addEventListener('click',ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        askTopic(t);
      });
      box.appendChild(b);
    });

    followups.forEach(f=>{
      const b=document.createElement('button');
      b.type='button';
      b.classList.add('pressure','dynamic-followup-topic');
      b.innerHTML=`<span>${f.label}</span><small class="topic-new-badge">Новый вопрос</small>`;
      b.addEventListener('click',ev=>{
        ev.preventDefault();
        ev.stopPropagation();
        if(f.kind==='stage2') askDynamicStage2(f.tid,f.chain);
        else askDynamicStage3(f.tid,f.chain);
      });
      box.appendChild(b);
    });

    if(!available.length && !followups.length){
      box.innerHTML='<div class="topics-empty">Пока у вас нет нового вопроса к этому человеку.</div>';
    }
  }

  function askDynamicStage2(tid,chain){
    const topic=suspects[currentSuspect]?.topics.find(t=>t.id===tid);
    if(!topic || !chain) return;
    currentTopic=topic;
    state.activeInterrogationTopics ||= {};
    state.activeInterrogationTopics[currentSuspect]=tid;
    const progress=getInterrogationProgress(currentSuspect,tid);
    if((progress.stage||1)>=2) return;
    progress.stage=2;
    progress.pressureEvidence=chain.pressureEvidence;
    rememberInterrogationNote(chain.pressureNote);
    state.talks[currentSuspect] ||= {};
    state.talks[currentSuspect][tid] ||= {text:topic.text,statement:!!topic.statement};
    state.talks[currentSuspect][tid].followupStage2=true;
    if(chain.openArchiveAtStage2) state.flags.archiveOpen=true;
    if(chain.pressureMood) $('#suspectMood').textContent=chain.pressureMood;
    $('#dialogueText').innerHTML=`<span class="dialogue-kicker">НОВЫЕ СВЕДЕНИЯ</span>${chain.pressureText}`;
    save();
    renderInterrogationStages();
    renderTopics();
    renderDossierMeta(currentSuspect);
    setObjective();
  }

  function askDynamicStage3(tid,chain){
    const topic=suspects[currentSuspect]?.topics.find(t=>t.id===tid);
    if(!topic || !chain || !chain.stage3Proof || !interrogationFactAvailable(chain.stage3Proof)) return;
    currentTopic=topic;
    state.activeInterrogationTopics ||= {};
    state.activeInterrogationTopics[currentSuspect]=tid;
    const progress=getInterrogationProgress(currentSuspect,tid);
    if((progress.stage||1)<2 || (progress.stage||1)>=3) return;
    progress.stage=3;
    progress.stage3Proof=chain.stage3Proof;
    rememberInterrogationNote(chain.stage3Note);
    const recordedNow=recordCaseStatement(chain.recordOnComplete);
    state.talks[currentSuspect] ||= {};
    state.talks[currentSuspect][tid] ||= {text:topic.text,statement:!!topic.statement};
    state.talks[currentSuspect][tid].threeStageComplete=true;
    if(chain.stage3Mood) $('#suspectMood').textContent=chain.stage3Mood;
    $('#dialogueText').innerHTML=`<span class="dialogue-kicker final">${chain.stage3Label==='Признание'?'ПРИЗНАНИЕ ПОЛУЧЕНО':chain.stage3Label==='Противоречие'?'ВЕРСИЯ ПОСТАВЛЕНА ПОД СОМНЕНИЕ':'ВЕРСИЯ ПРОВЕРЕНА'}</span>${chain.stage3Text}`;
    $('#checkStatementBtn')?.classList.add('hidden');
    currentStatement=null;
    save();
    renderInterrogationStages();
    renderTopics();
    renderDossierMeta(currentSuspect);
    setObjective();
    if(recordedNow && chain.recordOnComplete) toast(`Добавлено показание: ${evidenceDefs[chain.recordOnComplete].name}`);
  }

  function askTopic(t){
    currentTopic=t;
    state.activeInterrogationTopics ||= {};
    state.activeInterrogationTopics[currentSuspect]=t.id;
    state.activeInterrogationEvidence ||= {};
    state.activeInterrogationEvidence[currentSuspect]=null;
    selectedInterrogationEvidence=null;
    const dialogue=$('#dialogueText');
    if(dialogue) dialogue.textContent=t.text;
    state.talks[currentSuspect] ||= {};
    const prev=state.talks[currentSuspect][t.id] || {};
    state.talks[currentSuspect][t.id]={...prev,text:t.text,statement:!!t.statement};
    getInterrogationProgress(currentSuspect,t.id);
    const topicMode=t.mode || (suspects[currentSuspect]?.status==='Свидетель'?'witness':'version');
    if(t.record && !state.statements.includes(t.record)){
      state.statements.push(t.record);
      const recorded=evidenceDefs[t.record];
      toast(recorded?`Показание добавлено в материалы: ${recorded.name}`:'Показание записано');
    }
    if(currentSuspect==='liza' && t.id==='before') rememberInterrogationNote('Лиза подтверждает: Виктор вышел из кабинета с обычной папкой документов; семейная книга в нее не помещалась.');
    if(currentSuspect==='marina' && t.id==='family') rememberInterrogationNote('Марина считает, что Виктор не вправе единолично распоряжаться семейной книгой.');
    if(t.openLocation==='staff') state.flags.staffOpen=true;
    if(t.openLocation==='cellar') state.flags.cellarOpen=true;
    if(t.openLocation==='archive') state.flags.archiveOpen=true;
    save();
    if(topicMode==='witness' || topicMode==='context'){
      const p=getInterrogationProgress(currentSuspect,t.id); p.stage=3;
    }
    restoreCurrentTopicState();
    renderTopics();
    renderDossierMeta(currentSuspect);
    setObjective();
    maybeShowDetectiveInsight(`topic:${currentSuspect}:${t.id}`);
  }

  function openContradiction(){
    const chain=getCurrentInterrogationChain();
    if(!currentTopic || !chain || !chain.stage3Proof) return;
    const progress=getInterrogationProgress(currentSuspect,currentTopic.id);
    if(progress.stage<2){ toast('Сначала нужно пройти этап давления уликой'); return; }
    if(progress.stage>=3){ toast('Эта линия допроса уже завершена'); return; }

    selectedStage3Proof=null;
    $('#contradictionTitle').textContent=chain.stage3Title || (chain.stage3Label==='Противоречие' ? 'Какой материал ставит новую версию под сомнение?' : 'Какой материал помогает проверить новую версию?');
    $('#statementQuote').textContent=chain.pressureText;
    const facts=getStage3Facts();
    $('#contradictionChoices').innerHTML=facts.length
      ? facts.map(f=>`<button type="button" data-proof-key="${f.key}"><strong>${f.title}</strong><small>${f.text}</small></button>`).join('')
      : '<div class="deduction-empty">У вас пока нет материалов для третьего этапа.</div>';

    const confirm=$('#confirmContradictionProof');
    const hint=$('#contradictionSelectionHint');
    if(confirm) confirm.disabled=true;
    const proofAvailable=facts.some(f=>f.key===chain.stage3Proof);
    if(hint) hint.textContent=proofAvailable
      ? 'Выберите один материал. Он должен проверять именно последнюю версию, а не просто быть связан с делом.'
      : 'Среди найденных материалов может не хватать нужной проверки. Можно вернуться к расследованию и поискать новую зацепку.';

    $$('[data-proof-key]').forEach(b=>b.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      selectedStage3Proof=b.dataset.proofKey;
      $$('[data-proof-key]').forEach(x=>x.classList.toggle('selected',x===b));
      if(confirm) confirm.disabled=false;
      const title=b.querySelector('strong')?.textContent || 'выбранный материал';
      if(hint) hint.textContent=`Выбрано: ${title}. Теперь нажмите «Проверить выбранный материал».`;
    }));

    $('#contradiction').classList.remove('hidden');
  }

  function confirmContradictionProof(){
    if(!selectedStage3Proof){
      toast('Сначала выберите материал для проверки');
      return;
    }
    resolveContradiction(selectedStage3Proof);
  }

  function resolveContradiction(proofKey){
    const chain=getCurrentInterrogationChain();
    if(!chain || !currentTopic) return;
    const progress=getInterrogationProgress(currentSuspect,currentTopic.id);
    if(proofKey===chain.stage3Proof){
      progress.stage=3;
      progress.stage3Proof=proofKey;
      rememberInterrogationNote(chain.stage3Note);
      const recordedNow=recordCaseStatement(chain.recordOnComplete);
      state.talks[currentSuspect] ||= {};
      state.talks[currentSuspect][currentTopic.id] ||= {text:currentTopic.text,statement:!!currentTopic.statement};
      state.talks[currentSuspect][currentTopic.id].threeStageComplete=true;
      save();
      $('#contradiction').classList.add('hidden');
      $('#dialogueText').innerHTML=`<span class="dialogue-kicker final">${chain.stage3Label==='Признание'?'ПРИЗНАНИЕ ПОЛУЧЕНО':chain.stage3Label==='Противоречие'?'ВЕРСИЯ ПОСТАВЛЕНА ПОД СОМНЕНИЕ':'ВЕРСИЯ ПРОВЕРЕНА'}</span>${chain.stage3Text}`;
      if(chain.stage3Mood) $('#suspectMood').textContent=chain.stage3Mood;
      $('#checkStatementBtn')?.classList.add('hidden');
      currentStatement=null;
      renderInterrogationStages();
        renderDossierMeta(currentSuspect);
      setObjective();
      if(recordedNow && chain.recordOnComplete){
        toast(`Линия допроса завершена · добавлено показание: ${evidenceDefs[chain.recordOnComplete].name}`);
      } else {
        toast('Линия допроса завершена');
      }
    } else {
      const hint=$('#contradictionSelectionHint');
      if(hint) hint.innerHTML='<span class="stage3-wrong">Этот материал не опровергает новую версию. Выберите другой.</span>';
      selectedStage3Proof=null;
      $$('[data-proof-key]').forEach(x=>x.classList.remove('selected'));
      const confirm=$('#confirmContradictionProof');
      if(confirm) confirm.disabled=true;
      toast('Логическая связь не доказана');
    }
  }

  function runCaseIntegrityCheck(){
    const errors=[];
    const warnings=[];
    const relationIds=new Set(Object.keys(deductionRelationDefs));

    const validTalkKey=key=>{
      const m=/^t:([^:]+):(.+)$/.exec(key||'');
      if(!m) return false;
      return !!suspects[m[1]]?.topics.some(t=>t.id===m[2]);
    };
    const validFactRef=key=>{
      if(/^e:/.test(key||'')) return !!evidenceDefs[key.slice(2)];
      if(/^t:/.test(key||'')) return validTalkKey(key);
      if(/^d:/.test(key||'')) return !!deductionDefs[key.slice(2)];
      return false;
    };

    Object.entries(hotspotDefs).forEach(([loc,spots])=>{
      if(!locations[loc]) errors.push(`Неизвестная локация в hotspotDefs: ${loc}`);
      (spots||[]).forEach(h=>{
        if(h.action==='evidence' && !evidenceDefs[h.evidence]) errors.push(`Хотспот ${loc}/${h.id} ссылается на неизвестный материал ${h.evidence}`);
        if(h.action==='interrogate' && !suspects[h.suspect]) errors.push(`Хотспот ${loc}/${h.id} ссылается на неизвестного персонажа ${h.suspect}`);
        (h.requires||[]).forEach(key=>{ if(!validFactRef(key)) errors.push(`Хотспот ${loc}/${h.id} требует неизвестный факт ${key}`); });
        (h.hiddenAfter||[]).forEach(key=>{ if(!validFactRef(key)) errors.push(`Хотспот ${loc}/${h.id} скрывается по неизвестному факту ${key}`); });
      });
    });

    Object.entries(suspects).forEach(([sid,suspect])=>{
      if(!locations[suspect.loc]) errors.push(`Персонаж ${sid} привязан к неизвестной локации ${suspect.loc}`);
      const ids=new Set();
      suspect.topics.forEach(t=>{
        if(ids.has(t.id)) errors.push(`Дублирующаяся тема ${sid}:${t.id}`);
        ids.add(t.id);
        if(t.needs && !evidenceDefs[t.needs]) errors.push(`Тема ${sid}:${t.id} требует неизвестный материал ${t.needs}`);
        if(t.record && !evidenceDefs[t.record]) errors.push(`Тема ${sid}:${t.id} записывает неизвестный материал ${t.record}`);
        if(t.openLocation && !locations[t.openLocation]) errors.push(`Тема ${sid}:${t.id} открывает неизвестную локацию ${t.openLocation}`);
      });
    });

    Object.entries(interrogationChains).forEach(([sid,chains])=>{
      if(!suspects[sid]) errors.push(`Цепочка допроса у неизвестного персонажа ${sid}`);
      Object.entries(chains||{}).forEach(([tid,chain])=>{
        if(!suspects[sid]?.topics.some(t=>t.id===tid)) errors.push(`Цепочка ${sid}:${tid} не имеет соответствующей темы`);
        if(chain.pressureEvidence && !evidenceDefs[chain.pressureEvidence]) errors.push(`Цепочка ${sid}:${tid} требует неизвестный материал ${chain.pressureEvidence}`);
        if(chain.stage3Proof && !validFactRef(chain.stage3Proof)) errors.push(`Цепочка ${sid}:${tid} имеет неверную проверку ${chain.stage3Proof}`);
        if(chain.recordOnComplete && !evidenceDefs[chain.recordOnComplete]) errors.push(`Цепочка ${sid}:${tid} записывает неизвестный материал ${chain.recordOnComplete}`);
      });
    });

    const deductionSignatures=new Map();
    Object.entries(deductionDefs).forEach(([id,d])=>{
      if(d.derived) return;
      if(!relationIds.has(d.relation)) errors.push(`Вывод ${id} использует неизвестный тип связи ${d.relation}`);
      if(!Array.isArray(d.requires) || d.requires.length<2 || d.requires.length>3) errors.push(`Вывод ${id} должен требовать 2–3 материала`);
      (d.requires||[]).forEach(key=>{
        if(!validFactRef(key)) errors.push(`Вывод ${id} ссылается на неизвестный материал ${key}`);
        if(key===`d:${id}`) errors.push(`Вывод ${id} зависит сам от себя`);
      });
      const signature=`${d.relation}::${[...(d.requires||[])].sort().join('|')}`;
      if(deductionSignatures.has(signature)) errors.push(`Выводы ${deductionSignatures.get(signature)} и ${id} имеют одинаковую комбинацию и тип связи`);
      else deductionSignatures.set(signature,id);
    });

    finalDeductionIds.forEach(id=>{ if(!deductionDefs[id]) errors.push(`Финал требует отсутствующий вывод ${id}`); });

    // Reachability simulation: respects plot gates on topics, locations and hotspots.
    const openLocs=new Set(Object.entries(locations).filter(([,l])=>l.open).map(([id])=>id));
    const evidence=new Set();
    const statements=new Set();
    const talks=new Set();
    const deductions=new Set();
    const stage2=new Set();
    const stage3=new Set();
    let archiveOpened=false;

    const factAvailable=key=>{
      if(key.startsWith('e:')){
        const id=key.slice(2);
        return evidence.has(id)||statements.has(id);
      }
      if(key.startsWith('t:')) return talks.has(key);
      if(key.startsWith('d:')) return deductions.has(key.slice(2));
      return false;
    };

    const hotspotAvailableSim=h=>{
      if(h.needsDeduction && !deductions.has(h.needsDeduction)) return false;
      if(h.requires && !h.requires.every(factAvailable)) return false;
      if(h.hiddenAfter && h.hiddenAfter.some(factAvailable)) return false;
      return true;
    };

    const topicAvailableSim=(sid,t)=>{
      if(t.needs && !evidence.has(t.needs) && !statements.has(t.needs)) return false;
      if(t.unlockDeduction && !deductions.has(t.unlockDeduction)) return false;
      if(t.unlockTopic && !talks.has(`t:${sid}:${t.unlockTopic}`)) return false;
      if(t.requires && !t.requires.every(factAvailable)) return false;
      return true;
    };

    for(let pass=0;pass<120;pass++){
      let changed=false;
      if(archiveOpened && !openLocs.has('archive')){ openLocs.add('archive'); changed=true; }

      openLocs.forEach(loc=>{
        (hotspotDefs[loc]||[]).forEach(h=>{
          if(h.action==='evidence' && hotspotAvailableSim(h) && !evidence.has(h.evidence)){
            evidence.add(h.evidence); changed=true;
          }
        });
      });

      Object.entries(suspects).forEach(([sid,suspect])=>{
        suspect.topics.forEach(t=>{
          if(!topicAvailableSim(sid,t)) return;
          const key=`t:${sid}:${t.id}`;
          if(!talks.has(key)){
            talks.add(key); changed=true;
            if(t.openLocation && !openLocs.has(t.openLocation)){ openLocs.add(t.openLocation); changed=true; }
          }
          if(t.record && !statements.has(t.record)){ statements.add(t.record); changed=true; }
        });
      });

      Object.entries(interrogationChains).forEach(([sid,chains])=>{
        Object.entries(chains||{}).forEach(([tid,chain])=>{
          const ckey=`${sid}:${tid}`;
          if(!talks.has(`t:${sid}:${tid}`)) return;
          const pressureOk=!chain.pressureEvidence || evidence.has(chain.pressureEvidence) || statements.has(chain.pressureEvidence);
          if(pressureOk && !stage2.has(ckey)){
            stage2.add(ckey); changed=true;
            if(chain.openArchiveAtStage2 && !archiveOpened){ archiveOpened=true; changed=true; }
          }
          if(stage2.has(ckey) && chain.stage3Proof && factAvailable(chain.stage3Proof) && !stage3.has(ckey)){
            stage3.add(ckey); changed=true;
            if(chain.recordOnComplete && !statements.has(chain.recordOnComplete)){ statements.add(chain.recordOnComplete); changed=true; }
          }
        });
      });

      Object.entries(deductionDefs).forEach(([id,d])=>{
        if(d.derived || deductions.has(id)) return;
        if(d.requires.every(factAvailable)){
          deductions.add(id); changed=true;
          const canonicalMap={viktorHidBookFinance:'viktorHidBook',viktorHidBookCamera:'viktorHidBook',marinaAccessArchive:'marinaAccess',marinaAccessDialogue:'marinaAccess',marinaMovedCamera:'marinaMovedBook',marinaMovedKitchen:'marinaMovedBook',marinaMovedWitness:'marinaMovedBook'};
          const canonical=canonicalMap[id];
          if(canonical && !deductions.has(canonical)){ deductions.add(canonical); changed=true; }
        }
      });
      if(!changed) break;
    }

    Object.entries(evidenceDefs).forEach(([id,e])=>{
      const hasPhysicalSource=Object.values(hotspotDefs).some(spots=>(spots||[]).some(h=>h.action==='evidence'&&h.evidence===id));
      const hasStatementSource=Object.values(suspects).some(s=>s.topics.some(t=>t.record===id)) || Object.values(interrogationChains).some(chains=>Object.values(chains||{}).some(c=>c.recordOnComplete===id));
      if(e.type==='statement' && !hasStatementSource) errors.push(`Показание ${id} не имеет источника записи`);
      if(e.type!=='statement' && !hasPhysicalSource) warnings.push(`Физический материал ${id} не имеет хотспота`);
    });

    Object.keys(deductionDefs).forEach(id=>{ if(!deductions.has(id)) errors.push(`Вывод ${id} недостижим при полном прохождении`); });
    Object.entries(keyChainBySuspect).forEach(([sid,tid])=>{
      if(!stage3.has(`${sid}:${tid}`)) errors.push(`Ключевая линия допроса ${sid}:${tid} недостижима`);
    });
    finalDeductionIds.forEach(id=>{ if(!deductions.has(id)) errors.push(`Финальный вывод ${id} недостижим`); });

    return {
      ok:errors.length===0,
      errors,
      warnings,
      reachable:{
        locations:[...openLocs],
        evidence:[...evidence],
        statements:[...statements],
        talks:[...talks],
        interrogations:[...stage3],
        deductions:[...deductions]
      }
    };
  }



  function showPrologue(){
    const overlay=$('#prologueOverlay');
    if(!overlay) return;
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function closePrologue(){
    const overlay=$('#prologueOverlay');
    if(!overlay) return;
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    state.flags ||= {};
    if(!state.flags.prologueSeen){
      state.flags.prologueSeen=true;
      save();
    }
  }
  function howTo(){
    openModal('ОБУЧЕНИЕ','Как играть',`<div class="grid how-grid"><div class="card"><h3>1. Исследуйте</h3><p>Наводите курсор на предметы и персонажей. Важные зоны реагируют на наведение.</p></div><div class="card"><h3>2. Собирайте материалы</h3><p>Улики и зафиксированные показания попадают в раздел «Материалы» и используются для дедукции.</p></div><div class="card"><h3>3. Разговаривайте</h3><p>В начале доступны только базовые темы. Новые вопросы появляются по мере того, как вы находите улики и получаете выводы.</p></div><div class="card"><h3>4. Возвращайтесь к людям</h3><p>Новая зацепка может открыть дополнительный вопрос у уже опрошенного персонажа. Такие вопросы отмечаются как новые.</p></div><div class="card"><h3>5. Ведите расследование</h3><p>В разделе «Расследование» можно начать с «Матрицы подозреваемых»: сравните мотив, доступ, возможность и алиби каждого персонажа. Рядом оставлены «Реконструкция», «Версии», «Хронология» и «Противоречия» для сравнения механик.</p></div><div class="card"><h3>6. Проверяйте версии</h3><p>Если найденный факт меняет рассказ персонажа, следующий вопрос появится автоматически в блоке «Темы разговора».</p></div><div class="card"><h3>7. Проверяйте версии</h3><p>Подозрительные факты могут иметь разные объяснения. Проверяйте их уликами и показаниями, не делая вывод раньше времени.</p></div></div>`);
  }

  function syncStoryLibraryScroll(){
    const library=$('.menu-library');
    const grid=$('.menu-story-grid');
    if(!library || !grid) return;
    const storyCount=grid.querySelectorAll('.menu-story-card').length;
    library.classList.toggle('has-overflow-stories',storyCount>3);
    library.classList.remove('has-multiple-stories');
  }

  function syncMenuUI(){
    syncStoryLibraryScroll();
    const started=!!state.started;
    const menuStart=$('#menuStartBtn');
    const caseStart=$('#caseStartBtn');
    if(menuStart) menuStart.textContent=started ? 'Продолжить дело №1' : 'Открыть дело №1';
    if(caseStart) caseStart.textContent=started ? 'Продолжить расследование' : 'Начать расследование';
  }

  function startInvestigation(){
    state.started=true;
    save();
    syncMenuUI();
    showScreen('#gameScreen');
    renderScene();
    if(!state.flags?.prologueSeen){
      showPrologue();
    }
  }

  function resetProgress(){
    localStorage.removeItem(SAVE_KEY);
    window.MayakCase?.resetProgress?.();
    state=cloneDefault();
    syncMenuUI();
    renderScene();
    toast('Прогресс сброшен');
  }

  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-action]'); if(!a)return;
    const act=a.dataset.action;
    if(act==='start') startInvestigation();
    if(act==='how')howTo();
    if(act==='reset') resetProgress();
    if(act==='locked-case') toast('Эта детективная история появится в следующем обновлении.');
    if(act==='map')renderMap();
    if(act==='menu'){showScreen('#menuScreen');}
    if(act==='close-prologue'){ closePrologue(); }
    if(act==='close-modal'){
      const pending=pendingDetectiveInsightKey;
      pendingDetectiveInsightKey=null;
      closeModal();
      if(pending) setTimeout(()=>maybeShowDetectiveInsight(pending),40);
    }
    if(act==='exit-interrogation'){
      if($('#interrogation')?.dataset.case==='mayak' && window.MayakCase?.closeInterrogation){ window.MayakCase.closeInterrogation(); }
      else { closeModal(); $('#interrogation').classList.add('hidden'); renderScene(); }
    }
    if(act==='confirm-contradiction-proof')confirmContradictionProof();
    if(act==='select-interrogation-evidence'){
      const id=a.dataset.evidenceId;
      if(id && evidenceDefs[id]){
        ensureCurrentTopic();
        selectedInterrogationEvidence=id;
        state.activeInterrogationEvidence ||= {};
        state.activeInterrogationEvidence[currentSuspect]=id;
        save();
          }
    }
    if(act==='close-contradiction'){ selectedStage3Proof=null; $('#contradiction').classList.add('hidden'); }
  });

  $$('.dock [data-panel]').forEach(b=>b.addEventListener('click',()=>{
    if(b.closest('#mayakSceneScreen') && window.MayakCase?.showPanel){
      window.MayakCase.showPanel(b.dataset.panel);
      return;
    }
    ({people:renderPeople,evidence:renderEvidence,notebook:renderNotebook,case:renderCase}[b.dataset.panel])();
  }));



  // Global readability rule: no user-facing text is allowed below 16px.
  // We enforce this after dynamic renders so modals, interrogation panels and
  // deduction cards created later follow the same readability baseline.
  const MIN_TEXT_PX=16;
  const FONT_SKIP_SELECTOR=[
    'svg','path','canvas','img','video','audio','source','style','script','template',
    '.modal-close','[data-icon-only="true"]',
    '.evidence-icon','.deduction-history-status','.interrogation-stage-step b',
    '.dock button span','.person-icon','.hotspot-marker'
  ].join(',');

  function hasUserFacingOwnText(el){
    if(typeof HTMLElement==='undefined' || !(el instanceof HTMLElement)) return false;
    if(el.matches(FONT_SKIP_SELECTOR)) return false;
    const own=[...el.childNodes]
      .filter(n=>n.nodeType===Node.TEXT_NODE)
      .map(n=>n.textContent.replace(/\s+/g,' ').trim())
      .join(' ')
      .trim();
    if(!own) return false;
    if(/^[×✕✖✓✔◇◆§?+→←•·]+$/.test(own)) return false;
    return true;
  }

  function enforceMinimumTextSize(root=document){
    if(typeof getComputedStyle==='undefined' || typeof HTMLElement==='undefined') return;
    const nodes=[];
    if(root instanceof HTMLElement) nodes.push(root);
    if(root.querySelectorAll) nodes.push(...root.querySelectorAll('*'));
    nodes.forEach(el=>{
      if(!hasUserFacingOwnText(el)) return;
      const size=parseFloat(getComputedStyle(el).fontSize||'0');
      if(size && size<MIN_TEXT_PX){
        el.style.setProperty('font-size',`${MIN_TEXT_PX}px`,'important');
        el.dataset.minFontApplied='16';
      }
    });
    root.querySelectorAll?.('select,input,textarea,option').forEach(el=>{
      const size=parseFloat(getComputedStyle(el).fontSize||'0');
      if(size && size<MIN_TEXT_PX) el.style.setProperty('font-size',`${MIN_TEXT_PX}px`,'important');
    });
  }

  if(typeof MutationObserver!=='undefined' && typeof Node!=='undefined' && document.body){
    const minFontObserver=new MutationObserver(records=>{
      for(const record of records){
        record.addedNodes.forEach(node=>{
          if(node.nodeType===Node.ELEMENT_NODE) enforceMinimumTextSize(node);
        });
      }
    });
    minFontObserver.observe(document.body,{childList:true,subtree:true});
  }

  const integrityReport=runCaseIntegrityCheck();
  window.__CASE_DEBUG__={
    SAVE_KEY,
    runCaseIntegrityCheck,
    getIntegrityReport:()=>runCaseIntegrityCheck(),
    getState:()=>JSON.parse(JSON.stringify(state)),
    definitions:{locations,evidenceDefs,deductionDefs,suspects,interrogationChains,keyChainBySuspect,finalDeductionIds,collectibleDefs}
  };
  if(!integrityReport.ok) console.error('Case integrity check failed',integrityReport);
  else if(integrityReport.warnings.length) console.warn('Case integrity warnings',integrityReport.warnings);

  syncMenuUI();
  renderScene();
  updateInvestigationDock();
  enforceMinimumTextSize(document);
})();
