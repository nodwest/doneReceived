# Graph Report - doneReceived-develop-fixes  (2026-11-25)

## Corpus Check
- 895 files · ~429,637 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .graphify-bak 1, .csv 1)

## Summary
- 4528 nodes · 13861 edges · 221 communities (170 shown, 51 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 324 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f07af91f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- theme/index.ts
- ui/tasks.tsx
- feed-item.tsx
- transaction-card.tsx
- bar-3d.tsx
- children-carousel.tsx
- package.json
- root-layout.tsx
- maplibre-gl-worker.mjs
- ds
- date-time-picker-sheet.tsx
- my-tasks.tsx
- Находки
- yt
- subdividePolygonInternal
- auth-api.ts
- theme.ts
- fw
- device-api.ts
- english-words/index.ts
- ui/index.ts
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- ii
- writeTag
- i18n/index.ts
- words-overview.ts
- apiRequest
- useCurrentFamily
- child-languages.tsx
- session-storage.web.ts
- bus-playback.ts
- evaluate
- lib/index.ts
- oe
- useSessionStore
- config.ts
- map-history.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- showToast
- task-pager.tsx
- withAlpha
- queryIntersectsFeature
- expo
- session/index.ts
- words-check.tsx
- layer-preferences.ts
- server-child-profile.tsx
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- word-viewer.tsx
- task-sheet.tsx
- session/index.ts
- road-path.ts
- family-task-app-wireframes.canvas.tsx
- clone
- operation/index.ts
- family-event-form.tsx
- step1-onboarding-design.canvas.tsx
- n
- constructor
- use-push-registration.ts
- child-words-card.tsx
- pe
- GradientButton
- setPaintProperty
- paths
- task-sheet.tsx
- jy
- recent-activity.tsx
- home-summary.tsx
- Wu
- words-task.ts
- hasDebugData
- user/index.ts
- Icon
- zm
- xt
- session-refresh-lock.ts
- parent-delete-account.tsx
- i
- queryRadius
- Expo Router Navigation
- React Native Best Practices
- session/index.ts
- drag-handle.tsx
- scripts
- eh
- en
- icon.tsx
- T
- ui/transactions.tsx
- paint
- maplibre-gl
- checklist-field.tsx
- Релиз.md
- TabScreen
- Expo Upgrade
- avatar-cropper.tsx
- splitTile
- isApiError
- speech.ts
- use-pair-device.ts
- l
- oh
- use-words-settings.ts
- interpolate
- create-task-form.tsx
- en
- server-tasks-api.ts
- Английские слова для вкладки «Языки»
- appendLeaves
- getColorRampTextures
- layout
- use-child-location-sharing.ts
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- map/map.tsx
- _refreshViews
- update
- syncData
- family-color-palettes.canvas.tsx
- authorizedImage
- Gamified Household Task Profile Dashboard
- Child Device Pairing Codes
- Retryable Task Rejection
- wrap
- CLAUDE.md
- ot
- Dp
- parent-funds-api.ts
- ov
- setValue
- react-compiler-destructure-functions.md
- Design System Audit
- Frontend JavaScript Security
- Android Icon Background Template
- Application Favicon
- sortFeatures
- bb
- geometryType
- empty
- prepareSegment
- _unit
- withinInto
- canvases/mvp-c4-business-logic.canvas.tsx
- Expo Animation Recipes
- Native Platform Menus
- Centered Proportion Guides
- addSymbols
- angleWith
- containsMaxSafeIntegerValues
- crossFadingFactor
- deserializeCollisionBoxes
- dist
- expandBy
- hasOffscreenPass
- interpolationFactor
- l_
- push
- _S
- css.d.ts
- react-state-fallback.md
- rendering-text-in-text-component.md
- scroll-position-no-state.md
- ui-expo-image.md
- ui-image-gallery.md
- ui-measure-views.md
- child-location-task.web.ts
- openapi/README.md
- createIndex
- get
- eh
- apiRequest
- _h
- getClustersInternal
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- loadAndProcessGeoJSON
- family-color-palettes-new.canvas.tsx
- themedValue
- wish-form-sheet.tsx
- ref_cursor
- Icon
- use-new-code-glow.ts
- I18n and Accessibility Checklist
- Apache License 2.0
- Modern React Native Styling Patterns
- Blue Upward Chevron App Mark
- Monochrome Upward Chevron App Mark
- Geometric Blue Chevron App Icon
- User Profile Concept
- Child Location and Zones
- Repository Commit Format
- swipe.tsx
- AGENTS.override.md
- ui/rewards-history.tsx
- PickedPhoto
- role-routes.tsx
- api-image.web.tsx
- zustand
- formatClock

## God Nodes (most connected - your core abstractions)
1. `tracking()` - 259 edges
2. `react` - 248 edges
3. `react-native` - 243 edges
4. `theme` - 229 edges
5. `Icon()` - 185 edges
6. `createStyles()` - 152 edges
7. `useTheme()` - 100 edges
8. `apiRequest()` - 93 edges
9. `showToast()` - 80 edges
10. `react-native-svg` - 73 edges

## Surprising Connections (you probably didn't know these)
- `SEC-06 — Нет защиты от скриншотов на чувствительных экранах` --references--> `copyText()`  [INFERRED]
  obsidian-done/Сделал-получил/Уязвимости/Аудит клиента 2026-11-20.md → src/shared/lib/clipboard.ts
- `Проверено — чисто` --references--> `authorizedImage()`  [INFERRED]
  obsidian-done/Сделал-получил/Уязвимости/Аудит клиента 2026-11-20.md → src/shared/api/http.ts
- `Проверено — чисто` --references--> `themedValue()`  [INFERRED]
  obsidian-done/Сделал-получил/Уязвимости/Аудит клиента 2026-11-20.md → src/shared/theme/theme.ts
- `Проверено — чисто` --references--> `themedArray()`  [INFERRED]
  obsidian-done/Сделал-получил/Уязвимости/Аудит клиента 2026-11-20.md → src/shared/theme/theme.ts
- `mapEvent()` --indirect_call--> `authorizedImage()`  [INFERRED]
  src/entities/family-event/api/family-events-api.ts → src/shared/api/http.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (221 total, 51 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "theme/index.ts"
Cohesion: 0.03
Nodes (99): styles, styles, DeviceRowProps, styles, styles, FeaturedEventCardProps, styles, PeriodSelectProps (+91 more)

### Community 2 - "ui/tasks.tsx"
Cohesion: 0.10
Nodes (25): Проверено — чисто, CancelTaskButton(), ReviewActions(), authorOf(), ChildTasksPage(), NO_TASKS, ParentTasksPage(), CARDS_PADDING_BOTTOM (+17 more)

### Community 3 - "feed-item.tsx"
Cohesion: 0.05
Nodes (54): fetchSubmissionComments(), REASONS, SubmissionDto, ActivityDto, FeedChildLabel, FeedMemberLabel, FeedPage, fetchClosedAssignments() (+46 more)

### Community 4 - "transaction-card.tsx"
Cohesion: 0.21
Nodes (19): HeroPill(), useChildBalance(), formatBalance(), formatTransactionTotal(), transactionCode(), ChildBalance(), ChildBalanceProps, BalanceNote() (+11 more)

### Community 5 - "bar-3d.tsx"
Cohesion: 0.10
Nodes (32): DayTotals, formatMonthShort(), formatWeekdayShort(), CHART_HEIGHT, COLUMN_GAP, COLUMN_WIDTH, COLUMN_WIDTH_SELECTED, DATE_CHIP_HEIGHT (+24 more)

### Community 6 - "children-carousel.tsx"
Cohesion: 0.19
Nodes (10): ChildOverview, ChildCard(), SnapCarouselOptions, useSnapCarousel(), ChildrenCarousel(), ChildrenCarouselProps, CAROUSEL_GAP, CAROUSEL_GUTTER (+2 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (56): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-clipboard@~56.0.4, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11 (+48 more)

### Community 8 - "root-layout.tsx"
Cohesion: 0.11
Nodes (18): expo-font@~56.0.7, @expo-google-fonts/inter@^0.4.2, expo-status-bar@~56.0.4, expo-font, @expo-google-fonts/inter, expo-status-bar, APP_SCREENS, AUTH_SCREENS (+10 more)

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (31): ae(), cn, Db(), et(), I, lb(), li, ln() (+23 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (52): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+44 more)

### Community 11 - "date-time-picker-sheet.tsx"
Cohesion: 0.16
Nodes (17): clampDate(), endOfDay(), is24HourClock(), DateTimePickerSheet(), DateTimePickerSheetProps, HOURS_12, HOURS_24, MINUTES (+9 more)

### Community 12 - "my-tasks.tsx"
Cohesion: 0.14
Nodes (26): group(), sortTasksByUrgency(), time(), isWordsTask(), useWishlistProgress(), WordsTaskRow(), DoneButton(), TaskFooterAction() (+18 more)

### Community 13 - "Находки"
Cohesion: 0.11
Nodes (18): SEC-01 — Сессия в localStorage на вебе, SEC-02 — DoS через `expo-router` / `query-string`, SEC-03 — Фото детей остаются в кэше после повторной отправки, SEC-04 — Кэши аватаров не очищаются при смене аккаунта, SEC-05 — Почта в dev-логах, SEC-06 — Нет защиты от скриншотов на чувствительных экранах, SEC-07 — Нет certificate pinning, SEC-08 — Веб без CSP и security headers (+10 more)

### Community 14 - "yt"
Cohesion: 0.05
Nodes (48): A_(), addFeatures(), av(), bv(), Cu(), D_(), detectSdfPatterns(), Dv() (+40 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.05
Nodes (48): addCurrentVertex(), addFeature(), addHalfVertex(), addLine(), ap(), Bp(), cm(), cp() (+40 more)

### Community 16 - "auth-api.ts"
Cohesion: 0.21
Nodes (15): deleteMyAccount(), fetchAccountDeletionPreview(), AccountDeletionPreview, ChangePasswordPayload, DeleteAccountPayload, LoginPayload, MessageResponse, PairDevicePayload (+7 more)

### Community 17 - "theme.ts"
Cohesion: 0.19
Nodes (16): darkColors, lightColors, palettes, ThemeColors, ThemeMode, currentMode, getThemeMode(), setThemeModeValue() (+8 more)

### Community 18 - "fw"
Cohesion: 0.05
Nodes (43): Aw(), bw(), _C(), Cw(), decodeDictionary(), du(), Dw(), ew() (+35 more)

### Community 19 - "device-api.ts"
Cohesion: 0.12
Nodes (23): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft(), deviceKeys (+15 more)

### Community 20 - "english-words/index.ts"
Cohesion: 0.33
Nodes (7): hasWordsStudyProgress(), load(), storage, StudyState, useStudyStore, useWordsStudy(), WordsStudy

### Community 21 - "ui/index.ts"
Cohesion: 0.05
Nodes (40): ChildChipProps, ChipChild, AuthFootnoteProps, AuthLayoutProps, styles, Button(), ButtonProps, ButtonState (+32 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "ii"
Cohesion: 0.33
Nodes (6): ai(), Di(), ii(), ni(), oi(), ti()

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "i18n/index.ts"
Cohesion: 0.05
Nodes (44): expo-router, react-native-safe-area-context, useSessionFamilyId(), useParentFunds(), REWARD_PRESETS, CreateTaskButtonProps, WordsRewardSetupProps, enableLocationSharingWithToast() (+36 more)

### Community 27 - "words-overview.ts"
Cohesion: 0.23
Nodes (12): useWordsState(), WordsRange, useWordsOverview(), getWordsOverview(), portionStatus(), STATUSES, WordsOverview, WordsReward (+4 more)

### Community 28 - "apiRequest"
Cohesion: 0.08
Nodes (39): createChild(), createFamily(), createParentInvite(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers(), fetchMyFamilies() (+31 more)

### Community 29 - "useCurrentFamily"
Cohesion: 0.12
Nodes (22): deleteChild(), useCurrentFamily(), cancelFamilyEvent(), useFamilyEventsQuery(), eventCoversDay(), useDeleteChild(), useCancelFamilyEvent(), EMPTY_EVENTS (+14 more)

### Community 30 - "child-languages.tsx"
Cohesion: 0.26
Nodes (12): LanguagesRoute(), WORDS_PER_DAY, WordsIntro(), ChildLanguagesPage(), NO_TASKS, CheckScreen(), LanguagesHeader(), LanguagesPage() (+4 more)

### Community 31 - "session-storage.web.ts"
Cohesion: 0.31
Nodes (10): Session, parseSession(), SESSION_KEY, bumpSessionEpoch(), loadSession(), readSessionForRefresh(), removeSession(), saveSession() (+2 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.11
Nodes (26): Bus, RoadMovement, VehicleSnapshot, bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate() (+18 more)

### Community 33 - "evaluate"
Cohesion: 0.08
Nodes (31): br(), _calculate(), checkSubtype(), concat(), Cr(), dr(), er(), error() (+23 more)

### Community 34 - "lib/index.ts"
Cohesion: 0.11
Nodes (32): FeedItem(), TaskAssignee, ChildReviewRow(), ChildReviewRowProps, ChildTaskTile(), ChildTaskTileProps, TaskRow(), TaskRowProps (+24 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (29): b(), C(), D(), E(), ee(), emplaceBack(), f(), g() (+21 more)

### Community 36 - "useSessionStore"
Cohesion: 0.25
Nodes (18): refreshSession(), bumpSessionEpoch(), epochStorage, loadSession(), pendingLock, pendingWrite, readSessionForRefresh(), removeSession() (+10 more)

### Community 37 - "config.ts"
Cohesion: 0.11
Nodes (24): i18next@^26.5.8, react-i18next@^17.1.6, i18next, react-i18next, LanguageMenuProps, OPTIONS, detectLanguage(), resources (+16 more)

### Community 38 - "map-history.tsx"
Cohesion: 0.17
Nodes (16): HistoryData, historyDate(), HistoryDay(), HistoryType, MapHistory(), RouteData, styles, timeLabel() (+8 more)

### Community 39 - "map/model/types.ts"
Cohesion: 0.09
Nodes (18): backgroundLayer, buildings3dLayer, buildingLayer, houseNumbersLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer (+10 more)

### Community 40 - "evaluate"
Cohesion: 0.13
Nodes (28): aa(), Ba(), ca(), da(), ea(), fa(), ga(), Gi() (+20 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (28): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+20 more)

### Community 42 - "react"
Cohesion: 0.04
Nodes (67): react, react-native-svg, ArrowLeftIcon(), ArrowRightIcon(), BadgeCheckIcon(), BagCheckIcon(), BellIcon(), BookIcon() (+59 more)

### Community 43 - "mvp-apple-premium.canvas.tsx"
Cohesion: 0.19
Nodes (25): AppleBtn(), AppleField(), AppleLabel(), ApprovalScreen(), BalanceScreen(), ChildTasksScreen(), CreateTaskScreen(), FamilyTheme (+17 more)

### Community 44 - "devDependencies"
Cohesion: 0.09
Nodes (24): { defineConfig }, eslintPluginPrettierRecommended, expoConfig, devDependencies, babel-preset-expo@^57.0.1, eslint@^9.0.0, eslint-config-expo@~56.0.4, eslint-config-prettier@^10.1.8 (+16 more)

### Community 45 - "hx"
Cohesion: 0.08
Nodes (26): ax(), bx(), cx(), dx(), ex(), fx(), gx(), hx() (+18 more)

### Community 46 - "af"
Cohesion: 0.12
Nodes (25): af(), bf(), cf(), df(), ff(), Gf(), Hf(), If() (+17 more)

### Community 47 - "showToast"
Cohesion: 0.06
Nodes (53): expo-linear-gradient, familyEventCover(), FILLS, WishRow(), WishRowProps, WishThumb(), AddChildSheet(), AddChildSheetProps (+45 more)

### Community 48 - "task-pager.tsx"
Cohesion: 0.27
Nodes (9): CarouselDots(), SnapCarousel(), TaskCarouselProps, AnimatedPager, styles, TaskPager(), TaskPages(), TaskPagerProps (+1 more)

### Community 49 - "withAlpha"
Cohesion: 0.14
Nodes (14): styles, styles, styles, isCommentRequired(), RejectReasonSheet(), RejectReasonSheetProps, styles, withAlpha() (+6 more)

### Community 50 - "queryIntersectsFeature"
Cohesion: 0.20
Nodes (12): dd(), gm(), Gu(), Hm(), Ju(), Ku(), _m(), qu() (+4 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+14 more)

### Community 52 - "session/index.ts"
Cohesion: 0.07
Nodes (38): @tanstack/react-query, FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), useServerEvents(), AppEffects(), privateScope(), Providers() (+30 more)

### Community 53 - "words-check.tsx"
Cohesion: 0.19
Nodes (18): react-native-reanimated, shuffled(), cardEntering, cardExiting, checkDeck(), WordsCheck(), WordsCheckProps, ICON_COLORS (+10 more)

### Community 54 - "layer-preferences.ts"
Cohesion: 0.13
Nodes (16): asBoolean(), asIds(), DEFAULT_CHILD_MARKER_COLOR, DEFAULT_PARENT_MARKER_COLOR, DEFAULT_SECTIONS, DEFAULT_SETTINGS, HIDDEN_FIELD, HiddenLayerKey (+8 more)

### Community 55 - "server-child-profile.tsx"
Cohesion: 0.09
Nodes (36): useFamilyChildren(), latestRewards(), sumTotals(), operationsInPeriod(), SummaryPeriod, OperationRow(), PeriodSelect(), useMyId() (+28 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "word-viewer.tsx"
Cohesion: 0.14
Nodes (20): getWord(), WORDS_TOTAL, SpeakButton(), escape(), hiddenProps(), splitExample(), WordCard(), WordCardProps (+12 more)

### Community 59 - "task-sheet.tsx"
Cohesion: 0.07
Nodes (33): CHECKLIST_ITEM_MAX_LENGTH, CHECKLIST_MAX_ITEMS, ChecklistItem, formatRewardShort(), TASK_NOTE_MAX_LENGTH, TASK_PHOTOS_MAX, TaskRejection, TaskWord (+25 more)

### Community 60 - "session/index.ts"
Cohesion: 0.14
Nodes (15): confirmEmailChange(), deleteMyAvatar(), requestEmailChange(), resendEmailChange(), updateMe(), uploadMyAvatar(), fetchMe(), meKeys (+7 more)

### Community 61 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.11
Nodes (19): add(), clone(), div(), divByPoint(), filter(), getAndRemove(), _getAndRemoveByKey(), has() (+11 more)

### Community 64 - "operation/index.ts"
Cohesion: 0.16
Nodes (14): KindColors, OPERATION_KIND_COLORS, MissedReason, Operation, OperationChild, OperationKind, OperationRejection, RewardPayload (+6 more)

### Community 65 - "family-event-form.tsx"
Cohesion: 0.06
Nodes (57): EventImageFactory, FamilyEventDto, FamilyEventPersonDto, FamilyEventDto, toFamilyEvent(), toPerson(), bodyOf(), createFamilyEvent() (+49 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.13
Nodes (17): A(), an(), n(), fy(), gy(), hy(), ji(), k() (+9 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "use-push-registration.ts"
Cohesion: 0.15
Nodes (27): expo-notifications@~56.0.26, expo-notifications, registerPushToken(), removePushToken(), forgetPushTokenForSignOut(), addPendingPushRemoval(), clearSavedPushToken(), markPushPermissionAsked() (+19 more)

### Community 70 - "child-words-card.tsx"
Cohesion: 0.29
Nodes (11): wordsDay(), wordsInRange(), deckFocus(), WordsRewardSetup(), ChildHead(), ChildWordsCard(), ChildWordsCardProps, Stat() (+3 more)

### Community 71 - "pe"
Cohesion: 0.23
Nodes (16): me(), y_(), b(), be(), d(), _e(), f(), ge() (+8 more)

### Community 72 - "GradientButton"
Cohesion: 0.06
Nodes (54): DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, requestError(), signUpCredentials(), useCooldown(), checkPasswordRules() (+46 more)

### Community 73 - "setPaintProperty"
Cohesion: 0.14
Nodes (15): dc(), fc(), fire(), gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), listens() (+7 more)

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "task-sheet.tsx"
Cohesion: 0.18
Nodes (28): formatAmount(), ChildTaskCard(), ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, RejectionNote(), TaskCard() (+20 more)

### Community 76 - "jy"
Cohesion: 0.20
Nodes (11): by(), eb(), ey(), iy(), jy(), ny(), ry(), ty() (+3 more)

### Community 77 - "recent-activity.tsx"
Cohesion: 0.28
Nodes (6): groupFeed(), ScreenSectionProps, styles, SectionHeader(), RecentActivity(), RecentActivityProps

### Community 78 - "home-summary.tsx"
Cohesion: 0.33
Nodes (6): HomeSummaryProps, card, styles, ACCENT_GRADIENTS, StatCard(), StatCardProps

### Community 79 - "Wu"
Cohesion: 0.33
Nodes (7): cd(), fd(), ld(), pd(), sd(), ud(), Wu()

### Community 80 - "words-task.ts"
Cohesion: 0.21
Nodes (7): BY_RANK, DeckEntry, WORDS, rangeOfRanks(), WORDS_DAY_START_HOUR, WORDS_REVIEW_COUNT, WORDS_REWARD_MAX

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "user/index.ts"
Cohesion: 0.10
Nodes (29): ROLE_COLORS, RoleColors, Child, ChildProfile, ParentProfile, GeoPoint, Presence, FamilyRole (+21 more)

### Community 84 - "Icon"
Cohesion: 0.05
Nodes (51): DeviceRow(), RewardButton(), RewardButtonProps, RewardVariant, styles, ConnectDevicePanel(), ConnectDevicePanelProps, formatLeft() (+43 more)

### Community 85 - "zm"
Cohesion: 0.20
Nodes (12): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+4 more)

### Community 86 - "xt"
Cohesion: 0.29
Nodes (7): dn(), jn(), off(), On(), once(), transitioned(), xt()

### Community 87 - "session-refresh-lock.ts"
Cohesion: 0.53
Nodes (5): lockFile, release(), tryAcquire(), wait(), withRefreshLock()

### Community 88 - "parent-delete-account.tsx"
Cohesion: 0.10
Nodes (22): useAccountDeletionPreview(), useSessionKind(), CancelTaskSheet(), CancelTaskSheetProps, styles, DeleteAccountSheet(), DeleteAccountSheetProps, DeleteAccountStep (+14 more)

### Community 89 - "i"
Cohesion: 0.22
Nodes (11): ac(), ay(), cy(), ic(), id(), ly(), oy(), sy() (+3 more)

### Community 90 - "queryRadius"
Cohesion: 0.50
Nodes (4): cg(), nd(), queryRadius(), rd()

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "session/index.ts"
Cohesion: 0.21
Nodes (13): login(), logout(), register(), resendVerification(), verifyEmail(), useViewerRoleStore, authLog(), forgetSignUp() (+5 more)

### Community 95 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+5 more)

### Community 96 - "eh"
Cohesion: 0.25
Nodes (8): ch(), im(), lh(), sh(), Sm(), wm(), xm(), zh()

### Community 97 - "en"
Cohesion: 0.27
Nodes (10): bc(), completeTask(), process(), processTask(), receive(), Sc(), sendAsync(), vc() (+2 more)

### Community 99 - "T"
Cohesion: 0.29
Nodes (10): Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile(), _parseWorkerTile() (+2 more)

### Community 100 - "ui/transactions.tsx"
Cohesion: 0.07
Nodes (46): TransactionsRoute(), feedHistoryStart(), groupFeedByDay(), getDayTotals(), getHistoryDays(), isSameDay(), PERIOD_DAYS, SUMMARY_PERIODS (+38 more)

### Community 101 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 102 - "maplibre-gl"
Cohesion: 0.07
Nodes (36): maplibre-gl@6.10.0, maplibre-gl, createLocationZone(), deleteLocationZone(), LocationZoneInput, updateLocationZone(), MapZone, ZonePoint (+28 more)

### Community 103 - "checklist-field.tsx"
Cohesion: 0.18
Nodes (15): ChecklistField(), ChecklistFieldProps, ChecklistHintIcon(), ChecklistPlusIcon(), HANDLE_DOTS, StepHandleIcon(), StepRemoveIcon(), Controller (+7 more)

### Community 104 - "Релиз.md"
Cohesion: 0.50
Nodes (4): Family Wallet MVP Architecture, Task Reward Lifecycle, Task Creator Mockup, Parent Child Reward MVP Flow

### Community 105 - "TabScreen"
Cohesion: 0.10
Nodes (24): LanguageMenu(), ChildWishPage(), ChildWishlistPage(), styles, back(), MapZonePage(), styles, zoneBounds() (+16 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "avatar-cropper.tsx"
Cohesion: 0.23
Nodes (12): cropPhoto(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance(), View2D (+4 more)

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "isApiError"
Cohesion: 0.13
Nodes (25): deleteMyChildProfile(), RequestError, attemptsLeft(), ChangeEmailError, commonError(), confirmEmailChangeError(), info(), requestEmailChangeError() (+17 more)

### Community 110 - "speech.ts"
Cohesion: 0.40
Nodes (3): expo-speech@~56.0.3, expo-speech, speak()

### Community 111 - "use-pair-device.ts"
Cohesion: 0.22
Nodes (11): react-native-mmkv@^4.3.2, react-native-mmkv, connectCodeForApi(), pairChildDevice(), usePairDevice(), capitalize(), deviceLabel(), webLabel() (+3 more)

### Community 112 - "l"
Cohesion: 0.14
Nodes (14): ad(), anchorPoint(), bm(), dt(), getTilePoint(), l(), loadGeometry(), lt() (+6 more)

### Community 113 - "oh"
Cohesion: 0.33
Nodes (7): dh(), fh(), filterUpdate(), oh(), ph(), uh(), updateData()

### Community 114 - "use-words-settings.ts"
Cohesion: 0.15
Nodes (17): fetchWordsState(), saveWordsSettings(), toWordsState(), WordCardDto, WordsCheckResult, wordsPath(), WordsPortion, WordsServerStatus (+9 more)

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "create-task-form.tsx"
Cohesion: 0.11
Nodes (40): ChecklistStepPayload, ChildChip(), formatMoney(), buildCreateTaskPayload(), ChecklistDraftStep, checklistPayload(), FormActions, FormState (+32 more)

### Community 118 - "en"
Cohesion: 0.24
Nodes (10): Cn(), en(), hn(), mn(), nn(), qt(), rn(), Sn() (+2 more)

### Community 119 - "server-tasks-api.ts"
Cohesion: 0.06
Nodes (57): AssignmentDto, AttachmentDto, attachmentImage(), cancelServerTask(), checklistBody(), createServerTask(), fetchServerTasks(), LastRejectionDto (+49 more)

### Community 120 - "Английские слова для вкладки «Языки»"
Cohesion: 0.29
Nodes (6): Английские слова для вкладки «Языки», Можно ли больше, Откуда, Поля, Файлы, Что проверить человеку

### Community 121 - "appendLeaves"
Cohesion: 0.33
Nodes (6): appendLeaves(), getChildren(), getClusterExpansionZoom(), getLeaves(), getOriginId(), getOriginZoom()

### Community 122 - "getColorRampTextures"
Cohesion: 0.33
Nodes (6): _colorRampChanged(), _createColorRamp(), getColorRampTextures(), getUnpackVector(), Kd(), pack()

### Community 123 - "layout"
Cohesion: 0.33
Nodes (6): eg(), hd(), layout(), pp(), qy(), um()

### Community 124 - "use-child-location-sharing.ts"
Cohesion: 0.16
Nodes (21): expo-location, CHILD_LOCATION_TASK, startChildLocationTask(), stopChildLocationTask(), isLocationSharingEnabled(), locationSharingKey(), setLocationSharingEnabled(), storage (+13 more)

### Community 126 - "DoneReceived Project Guidance"
Cohesion: 0.40
Nodes (3): Mobile API Security Checklist, Repository Skill Catalog, DoneReceived Project Guidance

### Community 127 - "metro.config.js"
Cohesion: 0.29
Nodes (5): config, { getDefaultConfig }, expo@~56.0.22, { withAppBuildGradle }, expo

### Community 128 - "Seven-Step Task Definition Form"
Cohesion: 0.40
Nodes (5): Reward and Penalty Configuration, Deadline and Recurrence Configuration, Task Creation Screen, Seven-Step Task Definition Form, Task Image and Icon Selection

### Community 129 - "kb"
Cohesion: 0.40
Nodes (5): Ab(), Fb(), jb(), kb(), ob()

### Community 130 - "map/map.tsx"
Cohesion: 0.13
Nodes (28): useLocationZones(), busRouteKey(), isSnapshot(), useBusesSocket(), connect(), deviceLabel(), later(), LiveLocation (+20 more)

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 133 - "syncData"
Cohesion: 0.10
Nodes (32): useSessionUser(), setTaskStatus(), taskKeys, Task, depositFunds(), walletKeys, WishlistOwner, checkWords() (+24 more)

### Community 134 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 135 - "authorizedImage"
Cohesion: 0.09
Nodes (33): fetchOperations(), operationKeys, operationsQueryOptions(), ChildDto, fetchMissed(), fetchServerOperations(), MissedDto, MissedItemDto (+25 more)

### Community 136 - "Gamified Household Task Profile Dashboard"
Cohesion: 0.67
Nodes (4): Achievement Tracking, Gamified Household Task Profile Dashboard, User Progress Summary, Reward and Penalty Ledger

### Community 137 - "Child Device Pairing Codes"
Cohesion: 0.50
Nodes (3): Family Roles and Permissions, DoneReceived Codex Skill Strategy, DoneReceived Client State Stack

### Community 138 - "Retryable Task Rejection"
Cohesion: 0.50
Nodes (3): Retryable Task Rejection, Task Submission Comment, Per-Assignment Task Checklist

### Community 139 - "wrap"
Cohesion: 0.50
Nodes (4): bt(), distance(), pointOnLine(), wrap()

### Community 142 - "ot"
Cohesion: 0.50
Nodes (4): de(), ot(), pe(), ve()

### Community 143 - "Dp"
Cohesion: 0.50
Nodes (4): Dp(), geometry(), projectLine(), projectPoint()

### Community 144 - "parent-funds-api.ts"
Cohesion: 0.48
Nodes (5): fetchParentFunds(), ParentWalletDto, toFunds(), getParentFunds(), ParentFunds

### Community 145 - "ov"
Cohesion: 0.50
Nodes (4): ov(), patchUpdatedImage(), patchUpdatedImages(), sv()

### Community 146 - "setValue"
Cohesion: 0.67
Nodes (4): _propertyRootKey(), setTransition(), setValue(), setValues()

### Community 149 - "Frontend JavaScript Security"
Cohesion: 1.00
Nodes (3): Frontend JavaScript Security, React Web Security, Security Best Practices

### Community 151 - "Android Icon Background Template"
Cohesion: 1.00
Nodes (3): Android Icon Background Template, Center Alignment Guides, Circular Icon Safe Zones

### Community 152 - "Application Favicon"
Cohesion: 1.00
Nodes (3): Application Favicon, Blue Chevron Brand Mark, Rounded Square Icon Tile

### Community 153 - "sortFeatures"
Cohesion: 0.67
Nodes (3): addIndicesForPlacedSymbol(), getSortedSymbolIndexes(), sortFeatures()

### Community 154 - "bb"
Cohesion: 0.67
Nodes (3): bb(), url(), xb()

### Community 155 - "geometryType"
Cohesion: 0.67
Nodes (3): containsPolygonGeometry(), geometryType(), getGeometries()

### Community 156 - "empty"
Cohesion: 0.67
Nodes (3): covers(), empty(), intersects()

### Community 157 - "prepareSegment"
Cohesion: 0.67
Nodes (3): createNewSegment(), getOrCreateLatestSegment(), prepareSegment()

### Community 158 - "_unit"
Cohesion: 0.67
Nodes (3): _div(), mag(), _unit()

### Community 159 - "withinInto"
Cohesion: 0.67
Nodes (3): within(), withinInto(), xh()

### Community 160 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 188 - "createIndex"
Cohesion: 0.50
Nodes (4): cluster(), createIndex(), createTree(), load()

### Community 190 - "get"
Cohesion: 0.29
Nodes (8): backfillBorder(), get(), _getByteView(), getPixels(), _idx(), sampleBilinear(), unpack(), _unpackAtIndex()

### Community 191 - "eh"
Cohesion: 0.20
Nodes (10): ah(), eh(), ih(), jh(), Mh(), nh(), qm(), rh() (+2 more)

### Community 192 - "apiRequest"
Cohesion: 0.06
Nodes (50): vitest@^4.1.12, vitest, PushPlatform, RegisterPushTokenPayload, cancelActiveLocationPublish(), errorFrom(), LocationSessionBinding, publishChildLocation() (+42 more)

### Community 193 - "_h"
Cohesion: 0.40
Nodes (5): bh(), finish(), _h(), vh(), yh()

### Community 194 - "getClustersInternal"
Cohesion: 0.50
Nodes (4): getClusters(), getClustersInternal(), limitZoom(), wh()

### Community 197 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 198 - "loadAndProcessGeoJSON"
Cohesion: 0.25
Nodes (9): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), oe() (+1 more)

### Community 199 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

### Community 200 - "themedValue"
Cohesion: 0.07
Nodes (27): BadgeSize, GRADIENTS, ICON_SIZE, styles, TaskIconBadgeProps, FundsBar(), FundsBarProps, FundsLegendItem() (+19 more)

### Community 201 - "wish-form-sheet.tsx"
Cohesion: 0.08
Nodes (45): base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes(), saveServerWishPhotos(), toBody() (+37 more)

### Community 202 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

### Community 203 - "Icon"
Cohesion: 0.05
Nodes (46): react-native, useFamilyInvitePreview(), EventRowProps, formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), RoleIcon() (+38 more)

### Community 225 - "swipe.tsx"
Cohesion: 0.83
Nodes (3): Hand(), SwipeHorizontalIcon(), SwipeVerticalIcon()

### Community 249 - "ui/rewards-history.tsx"
Cohesion: 0.12
Nodes (35): useFamilyMembers(), useOperations(), sortByNewest(), useMe(), useMyAvatar(), useSession(), TaskViewer, TaskIconBadge() (+27 more)

### Community 250 - "PickedPhoto"
Cohesion: 0.18
Nodes (10): expo-file-system, expo-image-manipulator, CropRect, RemoteSource, RemoteSource, PhotoPermissionError, PhotoSource, PickedPhoto (+2 more)

### Community 251 - "role-routes.tsx"
Cohesion: 0.13
Nodes (10): ActivityRoute(), HomeRoute(), RewardsHistoryRoute(), TasksRoute(), WalletRoute(), useViewerRole(), ActivityPage(), ChildActivityPage() (+2 more)

### Community 252 - "api-image.web.tsx"
Cohesion: 0.19
Nodes (15): ApiImage(), ApiImageProps, clearPrivateImageCache(), download(), HeaderSource, imageRequests, load(), loaded (+7 more)

### Community 257 - "zustand"
Cohesion: 0.33
Nodes (4): zustand@^5.0.14, zustand, ToastKind, ToastState

### Community 259 - "formatClock"
Cohesion: 0.33
Nodes (10): EventTile(), EventTileProps, dayOffset(), formatClock(), formatCountdown(), formatDayHeader(), formatDayLabel(), formatMonthDay() (+2 more)

## Knowledge Gaps
- **45 isolated node(s):** `Pending`, `Done`, `Cancelled`, `expo/tsconfig.base`, `Family Wallet MVP Architecture` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1130 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `theme/index.ts`, `ui/tasks.tsx`, `feed-item.tsx`, `map/map.tsx`, `syncData`, `family-color-palettes.canvas.tsx`, `package.json`, `root-layout.tsx`, `children-carousel.tsx`, `bar-3d.tsx`, `date-time-picker-sheet.tsx`, `my-tasks.tsx`, `transaction-card.tsx`, `theme.ts`, `device-api.ts`, `english-words/index.ts`, `ui/index.ts`, `mvp-full-design-variants.canvas.tsx`, `i18n/index.ts`, `words-overview.ts`, `useCurrentFamily`, `child-languages.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `bus-playback.ts`, `lib/index.ts`, `map-history.tsx`, `mvp-apple-premium.canvas.tsx`, `showToast`, `task-pager.tsx`, `withAlpha`, `session/index.ts`, `words-check.tsx`, `server-child-profile.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `word-viewer.tsx`, `task-sheet.tsx`, `family-task-app-wireframes.canvas.tsx`, `operation/index.ts`, `family-event-form.tsx`, `step1-onboarding-design.canvas.tsx`, `apiRequest`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `use-push-registration.ts`, `family-color-palettes-new.canvas.tsx`, `GradientButton`, `wish-form-sheet.tsx`, `ref_cursor`, `task-sheet.tsx`, `Icon`, `use-new-code-glow.ts`, `child-words-card.tsx`, `recent-activity.tsx`, `home-summary.tsx`, `user/index.ts`, `Icon`, `parent-delete-account.tsx`, `drag-handle.tsx`, `swipe.tsx`, `icon.tsx`, `ui/transactions.tsx`, `maplibre-gl`, `checklist-field.tsx`, `TabScreen`, `avatar-cropper.tsx`, `create-task-form.tsx`, `api-image.web.tsx`, `server-tasks-api.ts`, `ui/rewards-history.tsx`, `use-child-location-sharing.ts`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `Pending`, `Done`, `Cancelled` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `Icon` to `theme/index.ts`, `ui/tasks.tsx`, `feed-item.tsx`, `formatClock`, `syncData`, `children-carousel.tsx`, `package.json`, `root-layout.tsx`, `transaction-card.tsx`, `map/map.tsx`, `date-time-picker-sheet.tsx`, `my-tasks.tsx`, `bar-3d.tsx`, `auth-api.ts`, `theme.ts`, `device-api.ts`, `ui/index.ts`, `i18n/index.ts`, `useCurrentFamily`, `child-languages.tsx`, `lib/index.ts`, `map-history.tsx`, `showToast`, `task-pager.tsx`, `withAlpha`, `session/index.ts`, `words-check.tsx`, `server-child-profile.tsx`, `word-viewer.tsx`, `task-sheet.tsx`, `operation/index.ts`, `family-event-form.tsx`, `apiRequest`, `use-push-registration.ts`, `child-words-card.tsx`, `themedValue`, `wish-form-sheet.tsx`, `GradientButton`, `task-sheet.tsx`, `recent-activity.tsx`, `home-summary.tsx`, `user/index.ts`, `Icon`, `parent-delete-account.tsx`, `ui/transactions.tsx`, `maplibre-gl`, `checklist-field.tsx`, `TabScreen`, `avatar-cropper.tsx`, `use-pair-device.ts`, `create-task-form.tsx`, `api-image.web.tsx`, `ui/rewards-history.tsx`, `PickedPhoto`, `use-child-location-sharing.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `theme/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02954422626553774 - nodes in this community are weakly interconnected._
- **Why does `apiRequest()` connect `apiRequest` to `feed-item.tsx`, `syncData`, `authorizedImage`, `auth-api.ts`, `parent-funds-api.ts`, `device-api.ts`, `i18n/index.ts`, `apiRequest`, `useCurrentFamily`, `useSessionStore`, `map-history.tsx`, `session/index.ts`, `session/index.ts`, `family-event-form.tsx`, `use-push-registration.ts`, `wish-form-sheet.tsx`, `Icon`, `session/index.ts`, `maplibre-gl`, `use-pair-device.ts`, `use-words-settings.ts`, `server-tasks-api.ts`, `use-child-location-sharing.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `ui/tasks.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._