# Graph Report - doneReceived  (2026-11-14)

## Corpus Check
- 710 files · ~226,889 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .graphify-bak 1, .base 1)

## Summary
- 3646 nodes · 10069 edges · 197 communities (152 shown, 45 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 288 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f459149`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- react-native
- ui/index.ts
- transfer-ownership-button.tsx
- server-tasks-api.ts
- authorizedImage
- i18n/index.ts
- package.json
- wish-form-sheet.tsx
- maplibre-gl-worker.mjs
- ds
- ui/family.tsx
- lib/index.ts
- my-tasks.tsx
- yt
- subdividePolygonInternal
- ui/tasks.tsx
- syncData
- fw
- day-column.tsx
- child-task-card.tsx
- child-home.tsx
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- ui/registration.tsx
- writeTag
- ui/family-setup.tsx
- showToast
- bar-3d.tsx
- expo-router
- entities/family/index.ts
- ui/role-select.tsx
- bus-playback.ts
- parse
- map.web.tsx
- oe
- auth-api.ts
- ui/change-password.tsx
- ui/verify-email.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- activity-card.tsx
- date-time-picker-sheet.tsx
- root-layout.tsx
- apiRequest
- expo
- api/index.ts
- create-task-form.tsx
- date.ts
- road-path.ts
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- task/index.ts
- avatar-cropper.tsx
- config.ts
- PickedPhoto
- family-task-app-wireframes.canvas.tsx
- clone
- map-layers-panel.tsx
- keep-in-view.ts
- step1-onboarding-design.canvas.tsx
- n
- constructor
- addFeature
- ui/rewards-history.tsx
- pe
- operations-query.ts
- setLayoutProperty
- paths
- constructor
- l
- checklist-field.tsx
- LetterAvatar
- uu
- use-location-socket.ts
- hasDebugData
- validation.ts
- en.ts
- zm
- queryIntersectsFeature
- Icon
- family-color-palettes.canvas.tsx
- i
- jy
- Expo Router Navigation
- React Native Best Practices
- canvases/mvp-c4-business-logic.canvas.tsx
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- scripts
- rh
- en
- period-select.tsx
- T
- family-color-palettes-new.canvas.tsx
- loadAndProcessGeoJSON
- paint
- note-draft-store.ts
- add
- home-summary.tsx
- Expo Upgrade
- ref_cursor
- splitTile
- get
- eh
- setPaintProperty
- Wu
- oh
- xt
- interpolate
- balance-card.tsx
- api-image.web.tsx
- buildings/index.ts
- water/index.ts
- V
- appendLeaves
- getColorRampTextures
- layout
- use-buses-socket.ts
- pill-button.tsx
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- TaskStatus
- _refreshViews
- update
- icon.tsx
- task-list.tsx
- Task Reward Lifecycle
- Gamified Household Task Profile Dashboard
- Child Device Pairing Codes
- Retryable Task Rejection
- wrap
- CLAUDE.md
- createIndex
- ot
- Dp
- getClustersInternal
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
- drag-handle.tsx
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
- I18n and Accessibility Checklist
- Apache License 2.0
- Modern React Native Styling Patterns
- Blue Upward Chevron App Mark
- Monochrome Upward Chevron App Mark
- Geometric Blue Chevron App Icon
- User Profile Concept
- Child Location and Zones
- Repository Commit Format

## God Nodes (most connected - your core abstractions)
1. `react-native` - 258 edges
2. `theme` - 181 edges
3. `react` - 180 edges
4. `Icon()` - 133 edges
5. `tracking()` - 105 edges
6. `react-native-svg` - 64 edges
7. `apiRequest()` - 56 edges
8. `showToast()` - 49 edges
9. `expo-linear-gradient` - 44 edges
10. `n()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `oe()` --indirect_call--> `ne()`  [INFERRED]
  public/maplibre/maplibre-gl-shared.mjs → public/maplibre/maplibre-gl-worker.mjs
- `pe()` --indirect_call--> `ne()`  [INFERRED]
  public/maplibre/maplibre-gl-shared.mjs → public/maplibre/maplibre-gl-worker.mjs
- `q()` --indirect_call--> `n()`  [INFERRED]
  public/maplibre/maplibre-gl-worker.mjs → public/maplibre/maplibre-gl-shared.mjs
- `fetchMe()` --calls--> `apiRequest()`  [EXTRACTED]
  src/entities/session/api/me-query.ts → src/shared/api/http.ts
- `ChangePasswordError` --calls--> `isApiError()`  [EXTRACTED]
  src/features/change-password/model/change-password-error.ts → src/shared/api/http.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (197 total, 45 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "react-native"
Cohesion: 0.05
Nodes (33): react-native, FieldHintProps, styles, CancelTaskSheetProps, styles, webInputReset, webNoOutline, SectionHeadProps (+25 more)

### Community 2 - "ui/index.ts"
Cohesion: 0.04
Nodes (48): react-native-reanimated, BadgeSize, ICON_SIZE, styles, ChildChipProps, ChipChild, styles, ResetInviteCodeRowProps (+40 more)

### Community 3 - "transfer-ownership-button.tsx"
Cohesion: 0.33
Nodes (6): transferOwnership(), useTransferOwnership(), styles, TransferOwnershipButton(), TransferOwnershipButtonProps, PillButton()

### Community 4 - "server-tasks-api.ts"
Cohesion: 0.08
Nodes (43): AssignmentDto, AttachmentDto, attachmentImage(), checklistBody(), ChildDto, createServerTask(), fetchServerTasks(), LastRejectionDto (+35 more)

### Community 5 - "authorizedImage"
Cohesion: 0.08
Nodes (41): ChildWalletDto, fetchServerChildWallet(), MemberDto, ChildDto, fetchServerWallet(), TransactionsDto, fetchChildWallet(), fetchWallet() (+33 more)

### Community 6 - "i18n/index.ts"
Cohesion: 0.06
Nodes (46): expo-linear-gradient, ROLE_COLORS, RoleColors, Child, ChildProfile, ParentProfile, GeoPoint, Presence (+38 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-clipboard@~56.0.4, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-font@~56.0.7 (+44 more)

### Community 8 - "wish-form-sheet.tsx"
Cohesion: 0.09
Nodes (41): base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes(), saveServerWishPhotos(), toBody() (+33 more)

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (15): cn, Db(), et(), I, lb(), li, ln(), Ln (+7 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (53): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+45 more)

### Community 11 - "ui/family.tsx"
Cohesion: 0.09
Nodes (34): useFamilyMembers(), latestRewards(), sumTotals(), operationsInPeriod(), SummaryPeriod, OperationRow(), PeriodSelect(), useMyId() (+26 more)

### Community 12 - "lib/index.ts"
Cohesion: 0.07
Nodes (44): DeviceRow(), DeviceRowProps, styles, formatRewardShort(), TaskAssignee, AssigneeAvatar(), AssigneeAvatarProps, styles (+36 more)

### Community 13 - "my-tasks.tsx"
Cohesion: 0.08
Nodes (41): useChildBalance(), useWishlistProgress(), WishRow(), usePhotoDraft(), useDeleteWish(), useMyChildBalance(), useMyWishlistOwner(), useReorderWishes() (+33 more)

### Community 14 - "yt"
Cohesion: 0.06
Nodes (41): A_(), av(), bv(), Cu(), D_(), Dv(), E_(), emplace() (+33 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.08
Nodes (31): ap(), Bp(), _ensureNoPoleVertices(), _fillPoles(), Fp(), _generateInterEdgeVertices(), _generateIntraEdgeVertices(), _generateOutline() (+23 more)

### Community 16 - "ui/tasks.tsx"
Cohesion: 0.10
Nodes (24): authorOf(), ChildTasksPage(), NO_TASKS, ParentTasksPage(), CARDS_PADDING_BOTTOM, styles, TasksPage(), TasksScope (+16 more)

### Community 17 - "syncData"
Cohesion: 0.16
Nodes (18): @tanstack/react-query, createChild(), createFamily(), deleteChild(), joinFamilyByCode(), setChildAvatar(), useCurrentFamily(), createTask() (+10 more)

### Community 18 - "fw"
Cohesion: 0.08
Nodes (31): Aw(), bw(), _C(), Cw(), Dw(), ew(), fw(), gw() (+23 more)

### Community 19 - "day-column.tsx"
Cohesion: 0.16
Nodes (19): DayTotals, CHART_HEIGHT, COLUMN_GAP, COLUMN_WIDTH, COLUMN_WIDTH_SELECTED, DATE_CHIP_HEIGHT, DAY_SLOT_WIDTH, DEPTH_Y (+11 more)

### Community 20 - "child-task-card.tsx"
Cohesion: 0.07
Nodes (64): ChecklistItem, ChildTaskCard(), ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, styles, TaskCard() (+56 more)

### Community 21 - "child-home.tsx"
Cohesion: 0.14
Nodes (29): HomeRoute(), FeedItem(), useMe(), useMyAvatar(), useSession(), useSessionUser(), useChildAccount(), useFamilyOperations() (+21 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "ui/registration.tsx"
Cohesion: 0.20
Nodes (13): requestError(), RegistrationForm, HintTone, Login(), styles, EMPTY_FORM, Field, Registration() (+5 more)

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "ui/family-setup.tsx"
Cohesion: 0.09
Nodes (32): useFamilyInvitePreview(), FAMILY_NAME_MAX_LENGTH, formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), FoundInvite, InviteCodeState (+24 more)

### Community 27 - "showToast"
Cohesion: 0.11
Nodes (28): logout(), RoleIcon(), AddChildSheet(), useLogout(), JoinFamilyPanel(), useNewCodeGlow(), ResetInviteCodeRow(), ResetInviteCodeSheet() (+20 more)

### Community 28 - "bar-3d.tsx"
Cohesion: 0.10
Nodes (24): KindColors, OPERATION_KIND_COLORS, formatAmount(), OperationChild, OperationKind, RewardPayload, KindCube(), CAPTION (+16 more)

### Community 29 - "expo-router"
Cohesion: 0.11
Nodes (25): expo-router, useFamilyChildren(), depositFunds(), fetchParentFunds(), ParentWalletDto, toFunds(), useParentFunds(), formatMoney() (+17 more)

### Community 30 - "entities/family/index.ts"
Cohesion: 0.12
Nodes (27): createParentInvite(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers(), fetchMyFamilies(), previewFamilyInvite(), revokeParentInvite() (+19 more)

### Community 31 - "ui/role-select.tsx"
Cohesion: 0.07
Nodes (35): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft(), deviceKeys (+27 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.14
Nodes (23): Bus, RoadMovement, VehicleSnapshot, bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate() (+15 more)

### Community 33 - "parse"
Cohesion: 0.10
Nodes (25): br(), checkSubtype(), concat(), Cr(), dr(), error(), fr(), gr() (+17 more)

### Community 34 - "map.web.tsx"
Cohesion: 0.12
Nodes (19): maplibre-gl, Location, OSM_SOURCE, MAP_STYLE, userLayer, userSource, updateUserLocation(), vehicleIcon (+11 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (25): C(), D(), E(), emplaceBack(), f(), g(), gg(), L (+17 more)

### Community 36 - "auth-api.ts"
Cohesion: 0.12
Nodes (25): refreshSession(), fetchMe(), ChangePasswordPayload, LoginPayload, MessageResponse, PairDevicePayload, PairedDevice, RegisterPayload (+17 more)

### Community 37 - "ui/change-password.tsx"
Cohesion: 0.14
Nodes (18): changePassword(), checkPasswordRules(), validatePassword(), FieldHint(), PasswordRules(), PasswordRulesProps, styles, ChangePasswordError (+10 more)

### Community 38 - "ui/verify-email.tsx"
Cohesion: 0.16
Nodes (18): login(), register(), resendVerification(), verifyEmail(), useViewerRoleStore, authLog(), forgetSignUp(), rememberSignUp() (+10 more)

### Community 39 - "map/model/types.ts"
Cohesion: 0.14
Nodes (12): backgroundLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer, citiesMediumLayer, settlementsSmallLayer, poiLayer (+4 more)

### Community 40 - "evaluate"
Cohesion: 0.09
Nodes (38): aa(), ai(), Ba(), ca(), _calculate(), da(), Di(), ea() (+30 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (29): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+21 more)

### Community 42 - "react"
Cohesion: 0.04
Nodes (60): react, react-native-svg, EASE_IN_OUT, EASE_OUT, ArrowLeftIcon(), ArrowRightIcon(), BagCheckIcon(), BellIcon() (+52 more)

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
Cohesion: 0.09
Nodes (30): af(), bf(), bh(), cf(), df(), ff(), finish(), Gf() (+22 more)

### Community 47 - "activity-card.tsx"
Cohesion: 0.09
Nodes (26): ActivityDto, ChildDto, fetchFeed(), KNOWN, MemberDto, FEED_LIMIT, feedKeys, useFeed() (+18 more)

### Community 48 - "date-time-picker-sheet.tsx"
Cohesion: 0.15
Nodes (18): clampDate(), endOfDay(), formatDate(), is24HourClock(), DateTimePickerSheet(), DateTimePickerSheetProps, HOURS_12, HOURS_24 (+10 more)

### Community 49 - "root-layout.tsx"
Cohesion: 0.13
Nodes (17): FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), Providers(), queryClient, APP_SCREENS, AUTH_SCREENS, restoreSession() (+9 more)

### Community 50 - "apiRequest"
Cohesion: 0.18
Nodes (14): deleteMyAvatar(), updateMe(), uploadMyAvatar(), meKeys, useMyAvatarChange(), useUpdateMe(), ApiError, apiRequest() (+6 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (21): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+13 more)

### Community 52 - "api/index.ts"
Cohesion: 0.14
Nodes (20): tickServerChecklist(), tickChecklistItem(), taskKeys, Task, RequestError, useSetTaskStatus(), actionError(), useTaskActions() (+12 more)

### Community 53 - "create-task-form.tsx"
Cohesion: 0.10
Nodes (39): ChildChip(), REWARD_PRESETS, buildCreateTaskPayload(), ChecklistDraftStep, checklistPayload(), FormActions, FormState, initialState (+31 more)

### Community 54 - "date.ts"
Cohesion: 0.32
Nodes (11): capitalize(), useDayTitle(), dayOffset(), formatDayLabel(), formatMonthDay(), formatMonthShort(), formatWeekdayShort(), locale() (+3 more)

### Community 55 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "task/index.ts"
Cohesion: 0.14
Nodes (23): cancelServerTask(), reviewServerSubmission(), approveTask(), cancelTask(), family(), rejectTask(), setTaskStatus(), useCancelTask() (+15 more)

### Community 59 - "avatar-cropper.tsx"
Cohesion: 0.11
Nodes (20): react-native-safe-area-context, cropPhoto(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance() (+12 more)

### Community 60 - "config.ts"
Cohesion: 0.13
Nodes (19): expo-localization@~56.0.6, react-i18next@^17.1.6, react-native-mmkv@^4.3.2, expo-localization, react-i18next, react-native-mmkv, LanguageMenuProps, OPTIONS (+11 more)

### Community 61 - "PickedPhoto"
Cohesion: 0.16
Nodes (11): expo-file-system@~56.0.11, expo-file-system, expo-image-manipulator, CropRect, RemoteSource, RemoteSource, PhotoPermissionError, PhotoSource (+3 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.17
Nodes (12): clone(), div(), divByPoint(), matMult(), mult(), multByPoint(), perp(), rotate() (+4 more)

### Community 64 - "map-layers-panel.tsx"
Cohesion: 0.15
Nodes (16): MapPage(), styles, MapWeb(), styles, DEFAULT_VISIBILITY, loadVisibility(), MapLayerKey, MapLayerState (+8 more)

### Community 65 - "keep-in-view.ts"
Cohesion: 0.32
Nodes (7): currentOffset(), KeepInView, KeepInViewContext, keepInViewScrollStyle, measure(), Rect, useKeepInView()

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.16
Nodes (14): A(), an(), n(), fy(), gy(), hy(), ji(), k() (+6 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "addFeature"
Cohesion: 0.13
Nodes (21): addCurrentVertex(), addFeature(), addFeatures(), addHalfVertex(), addLine(), cm(), cp(), detectSdfPatterns() (+13 more)

### Community 70 - "ui/rewards-history.tsx"
Cohesion: 0.08
Nodes (33): RewardsHistoryRoute(), TasksRoute(), TransactionsRoute(), WalletRoute(), getDayTotals(), getHistoryDays(), isSameDay(), Operation (+25 more)

### Community 71 - "pe"
Cohesion: 0.22
Nodes (17): me(), y_(), b(), be(), d(), _e(), f(), ge() (+9 more)

### Community 72 - "operations-query.ts"
Cohesion: 0.27
Nodes (10): fetchOperations(), operationKeys, operationsQueryOptions(), useOperations(), ChildDto, fetchServerOperations(), MissedDto, OperationsViewer (+2 more)

### Community 73 - "setLayoutProperty"
Cohesion: 0.29
Nodes (7): dc(), fc(), mc(), pc(), recalculateVisibility(), setLayoutProperty(), _validate()

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "constructor"
Cohesion: 0.18
Nodes (12): ae(), R, re(), S(), constructor(), _getAvailableImages(), _getDEMWorkerSource(), _getGlobalState() (+4 more)

### Community 76 - "l"
Cohesion: 0.14
Nodes (14): ad(), anchorPoint(), bm(), dt(), getTilePoint(), l(), loadGeometry(), lt() (+6 more)

### Community 77 - "checklist-field.tsx"
Cohesion: 0.16
Nodes (16): ChecklistField(), ChecklistFieldProps, styles, ChecklistHintIcon(), ChecklistPlusIcon(), HANDLE_DOTS, StepHandleIcon(), StepRemoveIcon() (+8 more)

### Community 78 - "LetterAvatar"
Cohesion: 0.07
Nodes (25): ChildOverview, ChildCard(), ChildCardProps, styles, HERO_COLORS, ProfileHero(), ProfileHeroProps, styles (+17 more)

### Community 79 - "uu"
Cohesion: 0.17
Nodes (12): decodeDictionary(), du(), getTransition(), getValue(), getValueFromBuffer(), jt(), lw(), offsetToLengthBuffer() (+4 more)

### Community 80 - "use-location-socket.ts"
Cohesion: 0.24
Nodes (6): useSessionKind(), useLocationSocket(), API_URL, LOCATION_WS_URL, wsBaseUrl, startLocationTracking()

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "validation.ts"
Cohesion: 0.17
Nodes (13): DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, FieldError, LoginErrors, LoginForm, PASSWORD_RULES (+5 more)

### Community 84 - "en.ts"
Cohesion: 0.21
Nodes (9): i18next@^26.5.8, i18next, CustomTypeOptions, i18next, DeepStrings, Dictionary, en, ExtraPluralForms (+1 more)

### Community 85 - "zm"
Cohesion: 0.22
Nodes (11): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+3 more)

### Community 86 - "queryIntersectsFeature"
Cohesion: 0.14
Nodes (16): cg(), dd(), gm(), Gu(), Hm(), Ju(), Ku(), _m() (+8 more)

### Community 87 - "Icon"
Cohesion: 0.07
Nodes (39): expo-status-bar, TaskShortViewProps, RewardButton(), RewardButtonProps, RewardVariant, styles, WishStatus, storeUrl() (+31 more)

### Community 88 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 89 - "i"
Cohesion: 0.18
Nodes (13): ac(), ay(), cy(), ic(), id(), ly(), ni(), oy() (+5 more)

### Community 90 - "jy"
Cohesion: 0.13
Nodes (16): b(), by(), eb(), ee(), ey(), iy(), jy(), ky() (+8 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 94 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "rh"
Cohesion: 0.40
Nodes (5): ah(), ih(), jh(), Mh(), rh()

### Community 97 - "en"
Cohesion: 0.13
Nodes (19): bc(), Cn(), completeTask(), en(), hn(), mn(), process(), processTask() (+11 more)

### Community 98 - "period-select.tsx"
Cohesion: 0.22
Nodes (7): PeriodSelectProps, styles, AnchorRect, OptionState, SelectMenuOption, SelectMenuProps, styles

### Community 99 - "T"
Cohesion: 0.24
Nodes (12): T(), Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile() (+4 more)

### Community 100 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

### Community 101 - "loadAndProcessGeoJSON"
Cohesion: 0.29
Nodes (8): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), Z()

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "note-draft-store.ts"
Cohesion: 0.32
Nodes (7): zustand@^5.0.14, zustand, NO_PHOTOS, NoteDraftState, useNoteDraft(), useNoteDraftStore, without()

### Community 104 - "add"
Cohesion: 0.25
Nodes (8): add(), filter(), getAndRemove(), _getAndRemoveByKey(), getPositions(), lu(), remove(), setMaxSize()

### Community 105 - "home-summary.tsx"
Cohesion: 0.33
Nodes (6): HomeSummaryProps, card, styles, ACCENT_GRADIENTS, StatCard(), StatCardProps

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "get"
Cohesion: 0.25
Nodes (9): backfillBorder(), get(), _getByteView(), getPixels(), has(), _idx(), sampleBilinear(), unpack() (+1 more)

### Community 110 - "eh"
Cohesion: 0.20
Nodes (11): eh(), im(), lh(), nh(), qm(), Sm(), th(), wm() (+3 more)

### Community 111 - "setPaintProperty"
Cohesion: 0.33
Nodes (6): gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), setPaintProperty(), _updateColorRamp()

### Community 112 - "Wu"
Cohesion: 0.33
Nodes (7): cd(), fd(), ld(), pd(), sd(), ud(), Wu()

### Community 113 - "oh"
Cohesion: 0.25
Nodes (9): ch(), dh(), fh(), filterUpdate(), oh(), ph(), sh(), uh() (+1 more)

### Community 114 - "xt"
Cohesion: 0.22
Nodes (9): dn(), fire(), jn(), listens(), off(), On(), once(), transitioned() (+1 more)

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "balance-card.tsx"
Cohesion: 0.17
Nodes (13): FundsBar(), FundsBarProps, FundsLegendItem(), FundsLegendItemProps, FundsSegment, styles, RewardBudget(), RewardBudgetProps (+5 more)

### Community 117 - "api-image.web.tsx"
Cohesion: 0.38
Nodes (6): ApiImage(), HeaderSource, load(), loaded, ready, withHeaders()

### Community 118 - "buildings/index.ts"
Cohesion: 0.43
Nodes (3): buildings3dLayer, buildingLayer, houseNumbersLayer

### Community 119 - "water/index.ts"
Cohesion: 0.43
Nodes (3): waterLabelsLayer, waterLayer, waterwayLayer

### Community 120 - "V"
Cohesion: 0.40
Nodes (5): H(), replace(), U(), update(), V()

### Community 121 - "appendLeaves"
Cohesion: 0.33
Nodes (6): appendLeaves(), getChildren(), getClusterExpansionZoom(), getLeaves(), getOriginId(), getOriginZoom()

### Community 122 - "getColorRampTextures"
Cohesion: 0.33
Nodes (6): _colorRampChanged(), _createColorRamp(), getColorRampTextures(), getUnpackVector(), Kd(), pack()

### Community 123 - "layout"
Cohesion: 0.33
Nodes (6): eg(), hd(), layout(), pp(), qy(), um()

### Community 124 - "use-buses-socket.ts"
Cohesion: 0.33
Nodes (5): isSnapshot(), useBusesSocket(), connect(), VehiclesMessage, WS_URL

### Community 125 - "pill-button.tsx"
Cohesion: 0.40
Nodes (4): GRADIENTS, PillButtonProps, PillButtonVariant, styles

### Community 126 - "DoneReceived Project Guidance"
Cohesion: 0.40
Nodes (3): Mobile API Security Checklist, Repository Skill Catalog, DoneReceived Project Guidance

### Community 127 - "metro.config.js"
Cohesion: 0.40
Nodes (4): config, { getDefaultConfig }, expo@~56.0.22, expo

### Community 128 - "Seven-Step Task Definition Form"
Cohesion: 0.40
Nodes (5): Reward and Penalty Configuration, Deadline and Recurrence Configuration, Task Creation Screen, Seven-Step Task Definition Form, Task Image and Icon Selection

### Community 129 - "kb"
Cohesion: 0.40
Nodes (5): Ab(), Fb(), jb(), kb(), ob()

### Community 130 - "TaskStatus"
Cohesion: 0.50
Nodes (4): TaskStatus, Cancelled, Done, Pending

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 135 - "Task Reward Lifecycle"
Cohesion: 0.50
Nodes (4): Family Wallet MVP Architecture, Task Reward Lifecycle, Task Creator Mockup, Parent Child Reward MVP Flow

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

### Community 141 - "createIndex"
Cohesion: 0.50
Nodes (4): cluster(), createIndex(), createTree(), load()

### Community 142 - "ot"
Cohesion: 0.50
Nodes (4): de(), ot(), pe(), ve()

### Community 143 - "Dp"
Cohesion: 0.50
Nodes (4): Dp(), geometry(), projectLine(), projectPoint()

### Community 144 - "getClustersInternal"
Cohesion: 0.50
Nodes (4): getClusters(), getClustersInternal(), limitZoom(), wh()

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

## Knowledge Gaps
- **45 isolated node(s):** `Pending`, `Done`, `Cancelled`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 922 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-native`, `ui/index.ts`, `transfer-ownership-button.tsx`, `authorizedImage`, `i18n/index.ts`, `package.json`, `wish-form-sheet.tsx`, `icon.tsx`, `task-list.tsx`, `ui/family.tsx`, `lib/index.ts`, `my-tasks.tsx`, `ui/tasks.tsx`, `day-column.tsx`, `child-task-card.tsx`, `child-home.tsx`, `mvp-full-design-variants.canvas.tsx`, `ui/registration.tsx`, `ui/family-setup.tsx`, `showToast`, `bar-3d.tsx`, `expo-router`, `ui/role-select.tsx`, `drag-handle.tsx`, `map.web.tsx`, `ui/change-password.tsx`, `ui/verify-email.tsx`, `mvp-apple-premium.canvas.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `api/index.ts`, `create-task-form.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `task/index.ts`, `avatar-cropper.tsx`, `family-task-app-wireframes.canvas.tsx`, `map-layers-panel.tsx`, `keep-in-view.ts`, `step1-onboarding-design.canvas.tsx`, `ui/rewards-history.tsx`, `checklist-field.tsx`, `LetterAvatar`, `use-location-socket.ts`, `Icon`, `family-color-palettes.canvas.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `period-select.tsx`, `family-color-palettes-new.canvas.tsx`, `home-summary.tsx`, `ref_cursor`, `api-image.web.tsx`, `use-buses-socket.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `Pending`, `Done`, `Cancelled` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `ui/index.ts`, `transfer-ownership-button.tsx`, `server-tasks-api.ts`, `authorizedImage`, `i18n/index.ts`, `package.json`, `wish-form-sheet.tsx`, `task-list.tsx`, `ui/family.tsx`, `lib/index.ts`, `my-tasks.tsx`, `ui/tasks.tsx`, `day-column.tsx`, `child-task-card.tsx`, `child-home.tsx`, `ui/registration.tsx`, `ui/family-setup.tsx`, `showToast`, `bar-3d.tsx`, `expo-router`, `ui/role-select.tsx`, `auth-api.ts`, `ui/change-password.tsx`, `ui/verify-email.tsx`, `activity-card.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `api/index.ts`, `create-task-form.tsx`, `task/index.ts`, `avatar-cropper.tsx`, `PickedPhoto`, `map-layers-panel.tsx`, `keep-in-view.ts`, `ui/rewards-history.tsx`, `checklist-field.tsx`, `LetterAvatar`, `Icon`, `period-select.tsx`, `note-draft-store.ts`, `home-summary.tsx`, `balance-card.tsx`, `api-image.web.tsx`, `pill-button.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.05292353823088456 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `map.web.tsx` to `map/model/types.ts`, `package.json`, `water/index.ts`, `buildings/index.ts`, `road-path.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `ui/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03599374021909233 - nodes in this community are weakly interconnected._